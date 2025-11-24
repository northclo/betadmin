<template>
  <a-spin v-if="loading" class="partner-chart" />
  <div v-else ref="graphContainer" class="partner-chart" />
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount, onMounted, inject, computed } from "vue";
import { Graph, register, Rect, Label, ExtensionCategory } from "@antv/g6";
import { getData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link";
import { message } from "ant-design-vue";

const graphContainer = ref(null);

const DEFAULT_LEVEL = "detailed";

const dataSource = ref([]);
const loading = ref(true);

const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

let graph = null;

class ChartNode extends Rect {
  get data() {
    return this.context.model.getElementDataById(this.id).data;
  }

  get level() {
    return this.data.level || DEFAULT_LEVEL;
  }

  getLabelStyle() {
    const text = this.data.nickname;
    return {
      text,
      fill: "#000",
      fontSize: 14,
      fontWeight: 400,
      textAlign: "center",
      transform: [["translate", -0, -10]],
    };
  }

  getKeyStyle(attributes) {
    return {
      ...super.getKeyStyle(attributes),
      fill: "#c8e4f8",
    };
  }

  getIdStyle() {
    return {
      text: this.data.id,
      fontSize: 8,
      fontWeight: 300,
      textAlign: "center",
      transform: [["translate", -0, 15]],
    };
  }

  drawIdShape(attributes, container) {
    const style = this.getIdStyle(attributes);
    this.upsert("id", Label, style, container);
  }

  render(attributes = this.parsedAttributes, container = this) {
    super.render(attributes, container);
    this.drawIdShape(attributes, container);
  }
}

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
  if (!dataSource.value || dataSource.value.length === 0) return;

  const nodes = [];
  const edges = [];

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
        edges.push({ 
          source: String(targetIndex), 
          target: String(index) 
        });
      }
    }
  });

  if (!graph) {
    register(ExtensionCategory.NODE, "chart-node", ChartNode);
    graph = new Graph({
      container: graphContainer.value,
      data: { nodes, edges },
      node: {
        type: "chart-node",
        style: {
          labelPlacement: "center",
          lineWidth: 1,
          ports: [{ placement: "top" }, { placement: "bottom" }],
          radius: 2,
          shadowBlur: 10,
          shadowColor: "#e0e0e0",
          shadowOffsetX: 3,
          size: [150, 60],
          stroke: "#C0C0C0",
        },
      },
      edge: {
        type: "polyline",
        style: { router: { type: "orth" }, stroke: "#C0C0C0" },
      },
      layout: { 
        type: "dagre",
        rankdir: "TB",
        nodesep: 50,
        ranksep: 50,
      },
      autoFit: nodes.length === 1 ? { type: "view", padding: 50 } : "view",
      zoom: {
        min: 0.1,
        max: nodes.length === 1 ? 1.0 : 3.0,
      },
      behaviors: [],
    });
    graph.render();
    
    if (nodes.length === 1) {
      setTimeout(() => {
        if (graph) {
          const currentZoom = graph.getZoom();
          if (currentZoom > 1.0) {
            graph.zoomTo(1.0);
          }
          graph.fitCenter();
        }
      }, 100);
    }
  }
}

watch(
  () => loading.value,
  async (newVal) => {
    if (newVal === false) {
      await nextTick();
      createGraph();
    } else if (newVal === true && graph) {
      graph.destroy();
      graph = null;
    }
  },
  { immediate: true }
);

watch(
  () => dataSource.value,
  async () => {
    if (!loading.value) {
      await nextTick();
      if (graph) {
        graph.destroy();
        graph = null;
      }
      createGraph();
    }
  },
  { deep: true }
);

onMounted(() => {
  fetchData();
});

onBeforeUnmount(() => {
  if (graph) {
    graph.destroy();
    graph = null;
  }
});
</script>

<style scoped>
.partner-chart {
  padding: 28px;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.partner-chart :deep(canvas),
.partner-chart :deep(svg) {
  max-width: 100%;
}

.partner-chart :deep(.g6-node) {
  max-width: 150px !important;
}
</style>
