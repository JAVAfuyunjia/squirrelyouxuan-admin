<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12 " :sm="12" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">用户数量</div>
            <count-to :start-val="0" :end-val="userTotal" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">商品数量</div>
            <count-to :start-val="0" :end-val="goodsTotal" :duration="3000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shoppingCard">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">订单数量</div>
            <count-to :start-val="0" :end-val="orderTotal" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div id="main" style="width: 100%;height: 450px;"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { info } from "@/api/dashboard";
import CountTo from "vue-count-to";
import * as echarts from "echarts";

export default {
  components: {
    CountTo
  },
  data() {
    return {
      userTotal: 0,
      goodsTotal: 0,
      productTotal: 0,
      orderTotal: 0,
      charts: "",
    };
  },
  created() {

  },
  methods: {
    initEchartsData(Data) {
      let tempXData = [];
      let tempOpinionData = [];
      // 遍历data
      for (let i = 0; i < Data.length; i++) {
        tempXData.push(Data[i].orderDate);
        tempOpinionData.push(Data[i].orderCount);
      }
      this.drawLine("main",tempXData,tempOpinionData) 
    },
    drawLine(id,Xdata,opinionData) {
      this.charts = echarts.init(document.getElementById(id));
      this.charts.setOption({
        title: {
          left: "3%",
          top: "5%",
          text: "过去30天的订单数量" //标题文本，支持使用 \n 换行。
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          align: "right", //文字在前图标在后
          left: "3%",
          top: "15%",
          data: ["近30天"]
        },

        toolbox: {
          feature: {
            saveAsImage: {} //保存为图片
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          axisTick: {
            alignWithLabel: true //保证刻度线和标签对齐
          },
          data: Xdata //x坐标的名称
        },
        yAxis: {
          type: "value",
          boundaryGap: true,
          splitNumber: 10, //纵坐标数
          interval: 250 //强制设置坐标轴分割间隔
        },

        series: [
          {
            name: "30天",
            type: "line", //折线图line;柱形图bar;饼图pie
            stack: "总量",

            itemStyle: {
              color: "rgb(255, 144, 0)", //改变折线点的颜色
              lineStyle: {
                color: "rgb(255, 144, 0)" //改变折线颜色
              }
            },
            data: opinionData
          }
        ]
      });
    }
  },
  //调用
  mounted() {
    info().then(response => {
      this.userTotal = response.data.userCount;
      this.goodsTotal = response.data.skuCount;
      this.orderTotal = response.data.orderAllCount;
  
      // 初始化图表
      this.$nextTick(function() {
      this.initEchartsData(response.data.orderCountForChart);
    });
    });
 
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        background: #7f8f8f;
      }
      .icon-message {
        background: #bbc0c5;
      }
      .icon-money {
        background: #b1aeaf;
      }
      .icon-shoppingCard {
        background: #909f9c;
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #807779;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
