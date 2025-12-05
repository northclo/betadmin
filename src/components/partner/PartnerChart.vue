<template>
  <a-spin v-if="loading" class="partner-chart" />
  <div v-else ref="chartContainer" class="partner-chart">
    <div class="chart-wrapper">
      <svg class="edges-layer" :width="chartWidth" :height="chartHeight">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#C0C0C0" />
          </marker>
        </defs>
        <g :transform="getSvgTransform()">
          <g v-for="(edge, index) in edges" :key="`edge-${index}`">
            <path
              :d="getEdgePath(edge)"
              stroke="#C0C0C0"
              stroke-width="1"
              fill="none"
              marker-end="url(#arrowhead)"
            />
          </g>
        </g>
      </svg>
      
      <div class="nodes-layer" :style="getNodesLayerStyle()">
        <div
          v-for="(node) in positionedNodes"
          :key="`node-${node.id}`"
          class="partner-card"
          :style="getNodeStyle(node)"
        >
          <div class="partner-nickname">{{ node.data.nickname }}</div>
          <div class="partner-id">ID: {{ node.data.id }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount, inject, computed } from "vue";
import dagre from "dagre";
import { getData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link";
import { message } from "ant-design-vue";

const chartContainer = ref(null);
const chartWidth = ref(1200);
const chartHeight = ref(800);
const graphWidth = ref(1200);
const graphHeight = ref(800);
const scale = ref(1);
const offsetX = ref(0);
const offsetY = ref(0);

const dataSource = ref([]);
const loading = ref(true);
const positionedNodes = ref([]);
const edges = ref([]);

const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

const NODE_WIDTH = 150;
const NODE_HEIGHT = 60;
const PADDING = 20;

const fetchData = async () => {
  try {
    loading.value = true;
    const partners = await getData(apiLink.game_partner);
    dataSource.value = partners.data || [];
  } catch (error) {
    console.error('Error fetching partner data for chart:', error);
    message.error(error.message || trlang.value.failed_to_fetch_data);
    dataSource.value = [];
  } finally {
    loading.value = false;
  }
};

function createGraph() {
  if (!dataSource.value || dataSource.value.length === 0) {
    positionedNodes.value = [];
    edges.value = [];
    return;
  }

  const nodes = [];
  const graphEdges = [];

  const roleHierarchy = {
    headquater: 0,
    branch_office: 1,
    regional_office: 2,
    agency: 3,
    distributor: 4,
    store: 5,
    user: 6,
  };

  let topPartnerIndex = -1;
  let topPartnerLevel = Infinity;
  
  dataSource.value.forEach((item, index) => {
    if (item.role !== "user") {
      const level = roleHierarchy[item.role] ?? Infinity;
      if (level < topPartnerLevel) {
        topPartnerLevel = level;
        topPartnerIndex = index;
      }
    }
  });

  const latestIndexByRole = {};
  
  dataSource.value.forEach((item, index) => {
    if (item.role !== "user") {
      nodes.push({ id: String(index), data: item });
      latestIndexByRole[item.role] = index;
    }
  });
  
  dataSource.value.forEach((item, index) => {
    if (item.role !== "user") {
      if (index === topPartnerIndex) {
        return;
      }
      
      const currentLevel = roleHierarchy[item.role] ?? Infinity;
      let targetIndex = null;
      
      for (let parentLevel = currentLevel - 1; parentLevel >= 0; parentLevel--) {
        for (const [role, level] of Object.entries(roleHierarchy)) {
          if (level === parentLevel && latestIndexByRole[role] !== undefined) {
            targetIndex = latestIndexByRole[role];
            break;
          }
        }
        if (targetIndex !== null) break;
      }
      
      if (targetIndex === null && topPartnerIndex >= 0) {
        targetIndex = topPartnerIndex;
      }
      
      if (targetIndex !== null && targetIndex !== index) {
        graphEdges.push({ 
          source: String(targetIndex), 
          target: String(index) 
        });
      }
    }
  });

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: 'TB',
    nodesep: 50,
    ranksep: 50,
    marginx: 20,
    marginy: 20,
  });

  nodes.forEach(node => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  graphEdges.forEach(edge => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const positioned = nodes.map(node => {
    const dagreNode = g.node(node.id);
    return {
      ...node,
      x: dagreNode.x,
      y: dagreNode.y,
      width: dagreNode.width,
      height: dagreNode.height,
    };
  });

  if (positioned.length > 0) {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    positioned.forEach(node => {
      const left = node.x - node.width / 2;
      const right = node.x + node.width / 2;
      const top = node.y - node.height / 2;
      const bottom = node.y + node.height / 2;
      
      minX = Math.min(minX, left);
      maxX = Math.max(maxX, right);
      minY = Math.min(minY, top);
      maxY = Math.max(maxY, bottom);
    });
    
    const graphPadding = PADDING;
    const graphContentWidth = (maxX - minX) + (graphPadding * 2);
    const graphContentHeight = (maxY - minY) + (graphPadding * 2);
    
    const nodeOffsetX = graphPadding - minX;
    const nodeOffsetY = graphPadding - minY;
    
    positioned.forEach(node => {
      node.x += nodeOffsetX;
      node.y += nodeOffsetY;
    });
    
    edges.value = graphEdges.map(edge => {
      const sourceNode = positioned.find(n => n.id === edge.source);
      const targetNode = positioned.find(n => n.id === edge.target);
      if (sourceNode && targetNode) {
        return {
          ...edge,
          sourceX: sourceNode.x,
          sourceY: sourceNode.y + NODE_HEIGHT / 2,
          targetX: targetNode.x,
          targetY: targetNode.y - NODE_HEIGHT / 2,
        };
      }
      return edge;
    });
    
    graphWidth.value = graphContentWidth;
    graphHeight.value = graphContentHeight;
    
    positionedNodes.value = positioned;
    
    nextTick(() => {
      calculateScale();
    });
  } else {
    graphWidth.value = 1200;
    graphHeight.value = 800;
    positionedNodes.value = [];
    edges.value = [];
    scale.value = 1;
    offsetX.value = 0;
    offsetY.value = 0;
  }
}

function calculateScale() {
  if (!chartContainer.value || positionedNodes.value.length === 0) {
    return;
  }
  
  const containerRect = chartContainer.value.getBoundingClientRect();
  const availableWidth = containerRect.width - (PADDING * 2);
  const availableHeight = containerRect.height - (PADDING * 2);
  
  if (availableWidth <= 0 || availableHeight <= 0) {
    return;
  }
  
  const scaleX = availableWidth / graphWidth.value;
  const scaleY = availableHeight / graphHeight.value;
  const newScale = Math.min(scaleX, scaleY, 1);
  
  scale.value = newScale;
  
  const scaledWidth = graphWidth.value * newScale;
  const scaledHeight = graphHeight.value * newScale;
  
  offsetX.value = (availableWidth - scaledWidth) / 2 + PADDING;
  offsetY.value = (availableHeight - scaledHeight) / 2 + PADDING;
  
  chartWidth.value = containerRect.width;
  chartHeight.value = containerRect.height;
}

function getSvgTransform() {
  return `translate(${offsetX.value}, ${offsetY.value}) scale(${scale.value})`;
}

function getNodesLayerStyle() {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    width: `${graphWidth.value}px`,
    height: `${graphHeight.value}px`,
    transform: `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`,
    transformOrigin: 'top left',
  };
}

function getNodeStyle(node) {
  return {
    position: 'absolute',
    left: `${node.x - node.width / 2}px`,
    top: `${node.y - node.height / 2}px`,
    width: `${node.width}px`,
    height: `${node.height}px`,
  };
}

function getEdgePath(edge) {
  const dy = edge.targetY - edge.sourceY;
  
  const startX = edge.sourceX;
  const startY = edge.sourceY;
  
  const endX = edge.targetX;
  const endY = edge.targetY;
  
  const verticalOffset = Math.abs(dy) * 0.5;
  const midY = startY + (dy > 0 ? verticalOffset : -verticalOffset);
  const midX = endX;
  
  return `M ${startX} ${startY} L ${startX} ${midY} L ${midX} ${midY} L ${endX} ${endY}`;
}

watch(
  () => loading.value,
  async (newVal) => {
    if (newVal === false) {
      await nextTick();
      createGraph();
    }
  },
  { immediate: true }
);

watch(
  () => dataSource.value,
  async () => {
    if (!loading.value) {
      await nextTick();
      createGraph();
    }
  },
  { deep: true }
);

let resizeObserver = null;

onMounted(() => {
  fetchData();
  
  if (window.ResizeObserver && chartContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      calculateScale();
    });
    resizeObserver.observe(chartContainer.value);
  }
  
  window.addEventListener('resize', calculateScale);
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  window.removeEventListener('resize', calculateScale);
});
</script>

<style scoped>
.partner-chart {
  width: 100%;
  min-height: 400px;
  height: 400px;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
  display: flex;
  background: var(--surface-muted-color);
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.edges-layer {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

.nodes-layer {
  position: relative;
  z-index: 2;
}

.partner-card {
  position: absolute;
  background: #c8e4f8;
  border: 1px solid #C0C0C0;
  border-radius: 2px;
  box-shadow: 3px 3px 10px rgba(224, 224, 224, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: default;
  transition: box-shadow 0.2s;
}

.partner-card:hover {
  box-shadow: 3px 3px 15px rgba(224, 224, 224, 1);
}

.partner-nickname {
  font-size: 18px;
  font-weight: 400;
  color: #000;
  text-align: center;
  margin-bottom: 4px;
}

.partner-id {
  font-size: 16px;
  font-weight: 300;
  color: #000;
  text-align: center;
}
</style>
