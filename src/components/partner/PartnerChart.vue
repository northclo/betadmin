<template>
  <a-spin v-if="loading" class="partner-chart" />
  <div v-else ref="graphContainer" class="partner-chart" />
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from "vue";
import { Graph, register, Rect, Label, ExtensionCategory } from "@antv/g6";

const graphContainer = ref(null);

const DEFAULT_LEVEL = "detailed";

const props = defineProps({
  dataSource: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

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

function createGraph() {
  if (!props.dataSource || props.dataSource.length === 0) return;

  const nodes = [];
  const edges = [];

  let headquaterIndex = 0;
  let branchOfficeIndex = 0;
  let regionalOfficeIndex = 0;
  let agencyIndex = 0;
  let distributorIndex = 0;

  props.dataSource.forEach((item, index) => {
    if (item.role !== "user") nodes.push({ id: String(index), data: item });

    let target = 0;
    if (item.role === "headquater") {
      headquaterIndex = index;
      target = 0;
    } else if (item.role === "branchOffice") {
      branchOfficeIndex = index;
      target = headquaterIndex;
    } else if (item.role === "regionalOffice") {
      regionalOfficeIndex = index;
      target = branchOfficeIndex;
    } else if (item.role === "agency") {
      agencyIndex = index;
      target = regionalOfficeIndex;
    } else if (item.role === "distributor") {
      distributorIndex = index;
      target = agencyIndex;
    } else if (item.role === "store") {
      target = distributorIndex;
    }

    if (item.role !== "headquater" && item.role !== "user")
      edges.push({ target: String(index), source: String(target) });
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
      layout: { type: "dagre" },
      autoFit: "view",
      behaviors: [],
    });
    graph.render();
  } else {
    graph.changeData({ nodes, edges });
  }
}

watch(
  () => props.loading,
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

onBeforeUnmount(() => {
  if (graph) {
    graph.destroy();
    graph = null;
  }
});
</script>
