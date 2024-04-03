<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <el-form inline>
        <el-form-item label="订单号">
          <el-input
            type="text"
            width="100"
            placeholder="订单号"
            v-model="searchObj.orderNo"
            clearable
          />
        </el-form-item>

        <el-form-item label="订单状态">
          <el-select v-model="searchObj.orderStatus" clearable placeholder="订单状态">
            <el-option value="UNPAID" label="待支付" />
            <el-option value="WAITING_DELEVER" label="待发货" />
            <el-option value="WAITING_TAKE" label="待收货" />
            <el-option value="FINISHED" label="已完结" />
            <el-option value="CANCEL" label="已取消" />
          </el-select>
        </el-form-item>

        <el-form-item label="收货人">
          <el-input
            type="text"
            width="100"
            placeholder="收货人姓名"
            v-model="searchObj.receiverName"
            clearable
          />
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
        <el-button type="default" @click="resetData">清空</el-button>
      </el-form>
    </el-card>

    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;"
    >
      <el-table-column label="序号" width="55" align="center">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column prop="orderNo" label="订单号" width="130" />
      <el-table-column label="订单金额" width="140px">
        <template slot-scope="scope">
          <p>总额：￥{{ scope.row.originalTotalAmount }}</p>
        </template>
      </el-table-column>
      <el-table-column label="收货人" width="160px">
        <template slot-scope="scope">
          <p>姓名：{{ scope.row.receiverName }}</p>
          <p>电话：{{ scope.row.receiverPhone }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" width="200px">
        <template slot-scope="scope">
          <p>创建：{{ scope.row.createTime }}</p>
          <p>支付：{{ scope.row.paymentTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="150">
        <template slot-scope="scope">
          <p>状态：{{ scope.row.param.orderStatusName }}</p>
          <el-button
            type="primary"
            v-if="scope.row.orderStatus != 'UNPAID'" @click="opendialogChangeOrderStatus(scope.row.orderNo)"
          >修改状态</el-button>
        </template>
      </el-table-column>
      
    </el-table>

    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center;"
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      @current-change="fetchData"
      @size-change="changeSize"
    />

    <el-dialog :title="修改订单状态" :visible.sync="dialogChangeOrderStatus">
      <el-form ref="userForm" :model="user" :rules="userRules" label-width="120px">
        <el-form-item label="修改订单状态">
          <el-select v-model="orderStatus" clearable placeholder="请选择">
            <el-option value="2" label="待收货（商家已发货）" />
            <el-option value="3" label="已完结" />
            <el-option value="-1" label="已取消" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="orderStatusUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/order/orderInfo";
export default {
  data() {
    return {
      orderStatus:'',
      order: {},
      dialogChangeOrderStatus: false,
      listLoading: true, // 数据是否正在加载
      list: null, // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询表单对象
      multipleSelection: [] // 批量选择中选择的记录列表
    };
  },

  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    this.fetchData();
  },

  // 生命周期函数：内存准备完毕，页面渲染成功
  mounted() {},

  methods: {

    orderStatusUpdate(){
      let data = {
        orderNo: this.order.id,
        orderStatus: this.orderStatus
      }

      api.updateOrderStatus(data).then(response => {
        this.order = {};
        this.dialogChangeOrderStatus = false;
        this.fetchData(this.page)
      });
    },

    opendialogChangeOrderStatus(orderId) {
      this.order.id = orderId;
      this.dialogChangeOrderStatus = true;
    },

    // 当页码发生改变的时候
    changeSize(size) {
      console.log(size);
      this.limit = size;
      this.fetchData(1);
    },

    // 加载banner列表数据
    fetchData(page = 1) {
      // 异步获取远程数据（ajax）
      this.page = page;
      api.getPageList(this.page, this.limit, this.searchObj).then(response => {
        this.list = response.data.records;
        this.total = response.data.total;

        // 数据加载并绑定成功
        this.listLoading = false;
      });
    },

    // 重置查询表单
    resetData() {
      console.log("重置查询表单");
      this.searchObj = {};
      this.fetchData();
    }

    // 当表格复选框选项发生变化的时候触发
    // handleSelectionChange(selection) {
    //   console.log('handleSelectionChange......')
    //   console.log(selection)
    //   this.multipleSelection = selection
    // },

    // batchDeliver() {
    //   if (this.multipleSelection.length === 0) {
    //     this.$message({
    //       type: 'warning',
    //       message: '请选择要发货的记录!'
    //     })
    //     return
    //   }
    //
    //   this.multipleSelection.forEach(item => {
    //     if(item.orderStatus != 0) {
    //       this.$message({
    //         type: 'warning',
    //         message: '请选择未发货的记录，里面包含已发货记录!'
    //       })
    //       return
    //     }
    //   })
    //
    //   this.$confirm('确认该发货吗, 是否确认?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => { // promise
    //     // 点击确定，远程调用ajax
    //     var idList = []
    //     this.multipleSelection.forEach(item => {
    //       idList.push(item.id)
    //     })
    //     return api.batchDeliver(idList)
    //   }).then((response) => {
    //     if (response.code) {
    //       this.$message({
    //         type: 'success',
    //         message: '发货成功!'
    //       })
    //     }
    //     this.fetchData(this.page)
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消发货'
    //     })
    //   })
    // }
  }
};
</script>
