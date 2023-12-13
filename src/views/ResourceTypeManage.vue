<template>
  <div style="padding-bottom: 10px">
    <a-space>
      <a-button @click="addResourceType" type="primary">
        <template #icon>
          <PlusOutlined/>
        </template>
        新增资源类型
      </a-button>
      <a-button @click="addResourceDataType" type="primary" >
        <template #icon>
          <PlusOutlined/>
        </template>
        新增数据类型
      </a-button>
    </a-space>
  </div>
  <a-table
      :columns="resourceTypeColumns"
      :data-source="resourceTypeData"
      :loading="tableLoading"
  >
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'action'">
        <a-popconfirm
            title="是否确认删除该资源类型？确认后会删除资源类型关联下的所有资源"
            ok-text="确认"
            cancel-text="取消"
            @confirm="()=> confirmDelete(record)"
        >
          <a-button type="link" danger>删除</a-button>
        </a-popconfirm>
        <a-divider type="vertical"></a-divider>
        <a-button @click="()=> gotoResource(record)" type="link">查看绑定的资源</a-button>
      </template>
      <template v-if="column.dataIndex === 'attributes'">
        <span v-for="(item, itemIndex) in record.attributes">{{itemIndex}}：{{item.info}} <br /></span>
      </template>
      <span v-else>
          {{ record.resource_type[column.dataIndex]}}
      </span>
    </template>
  </a-table>
  <a-drawer
      v-model:open="open"
      title="新增资源类型"
      size="large"
      placement="right"
  >
    <template #extra>
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button :loading="submitLoading" type="primary" @click="submit">提交</a-button>
    </template>
    <a-form
        ref="formRef"
        name="dynamic_form_nest_item"
        :model="dynamicValidateForm"
        @finish="onFinish"
    >
      <a-form-item
          :rules="{required: true,message: '缺少资源类型名称',}"
          label="资源类型名称" name="name">
        <a-input
            v-model:value="dynamicValidateForm.name"
        />
      </a-form-item>
      <a-form-item
          :rules="{required: true,message: '缺少资源类型描述',}"
          label="资源类型描述" name="description">
        <a-input
            v-model:value="dynamicValidateForm.description"
        />
      </a-form-item>
      <a-space
          v-for="(attribute, index) in dynamicValidateForm.attributes"
          :key="attribute.id"
          style="display: flex; margin-bottom: 8px"
          align="baseline"
      >
        <a-form-item
            :name="['attributes', index, 'info']"
            :rules="{required: true,message: '缺少资源属性中文名称' }"
        >
          <a-input v-model:value="attribute.info" placeholder="资源属性中文名称"/>
        </a-form-item>
        <a-form-item
            :name="['attributes', index, 'name']"
            :rules="{required: true, validator: checkEnglishName }"
        >
          <a-input v-model:value="attribute.name" placeholder="资源属性英文名称"/>
        </a-form-item>
        <a-form-item
            :name="['attributes', index, 'data_type']"
            :rules="{required: true,message: '缺少资源属性类型',}"
        >
          <a-select
              v-model:value="attribute.data_type"
              :options="resourceTypeOptions"
              style="min-width: 100px"
              placeholder="资源属性类型"
          ></a-select>
        </a-form-item>
        <MinusCircleOutlined @click="removeAttribute(attribute)"/>
      </a-space>
      <a-form-item>
        <a-button type="dashed" block @click="addAttribute">
          <PlusOutlined/>
          新增资源类型属性
        </a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
  <a-drawer
      v-model:open="dataTypeOpen"
      title="新增数据类型"
      size="large"
      placement="right"
  >
    <template #extra>
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button :loading="dataTypeLoading" type="primary" @click="submitAddDataType">新增</a-button>
    </template>
    <a-form
        ref="dataTypeFormRef"
        name="dynamic_form_nest_item"
        :model="dataTypeForm"
    >
      <a-form-item
          :rules="{required: true,message: '缺少数据类型中文名',}"
          label="数据类型中文名" name="info">
        <a-input
            v-model:value="dataTypeForm.info"
        />
      </a-form-item>
      <a-form-item
          :rules="{required: true,message: '缺少数据类型英文名',}"
          label="数据类型英文名" name="name"
      >
        <a-input
            placeholder="现在仅支持string, int, float, boolean"
            v-model:value="dataTypeForm.name"
        />
      </a-form-item>
    </a-form>
    <a-table
        :columns="resourceDataTypeColumns"
        :data-source="resourceDataTypeData"
        :loading="tableDataLoading"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'action'">
          <a-popconfirm
              title="是否确认删除该数据类型？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="()=> confirmDeleteDataType(record)"
          >
            <a-button type="link" danger>删除</a-button>
          </a-popconfirm>
        </template>
        <template v-if="column.dataIndex === 'date'">
          <span>2023/12/10 15:12:00</span>
        </template>
        <span v-else>
          {{ text }}
      </span>
      </template>
    </a-table>
  </a-drawer>
</template>
<script setup lang="ts">
import { resourceDataTypeColumns, resourceTypeColumns } from "@/constants/constant";
import { onMounted, ref, reactive, watch, computed } from "vue";
import {
  createDataType,
  createResourceType,
  deleteDataType,
  deleteResourceType,
  fetchAllDataType,
  fetchAllResourceType
} from "@/api/resource";
import { isSuccess } from "@/utils";
import { message } from 'ant-design-vue';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';
import { useRouter } from "vue-router";
const router = useRouter()


const resourceTypeData = ref<any[]>([]);
const resourceDataTypeData = ref<any[]>([]);
const tableLoading = ref<boolean>(false);
const tableDataLoading = ref<boolean>(false);
const submitLoading = ref<boolean>(false);
const dataTypeLoading = ref<boolean>(false);
const open = ref<boolean>(false);
const dataTypeOpen = ref<boolean>(false);
const dataTypeFormRef = ref();
const dataTypeForm = reactive({
  name: '',
  info: '',
})
const resourceTypeOptions = computed(() => {
  return resourceDataTypeData.value.map(item => {
    return {
      label: item.info,
      value: item.id
    }
  })
})


interface Type {
  data_type: string;
  name: string;
  info: string;
}

interface ResourceType {
  name: string;
  description: string;
  attributes: Type[];
}

const formRef = ref<FormInstance>();
const dynamicValidateForm = reactive<ResourceType>({
  name: '',
  description: '',
  attributes: [],
});

const checkEnglishName = (rule, value) => {
  // 可以是英文数字和下划线
  const reg = /^[a-zA-Z0-9_]+$/;
  if (!value) return Promise.reject('资源属性英文名称不能为空');
  if (!reg.test(value)) {
    return Promise.reject('只能是英文数字和下划线');
  }
  return Promise.resolve();
};
const removeAttribute = (item: Type) => {
  const index = dynamicValidateForm.attributes.indexOf(item);
  if (index !== -1) {
    dynamicValidateForm.attributes.splice(index, 1);
  }
};
const gotoResource = ({resource_type}) => {
  router.push({
    name: 'resourceManage',
    query: {
      resource_type_id: resource_type.id
    }
  })
}
const addAttribute = () => {
  dynamicValidateForm.attributes.push({
    name: '',
    data_type: undefined ,
    info: '',
  });
};
const onFinish = values => {
};

const onCheck = async (ref) => {
  try {
    const values = await ref.value.validateFields();
    console.log('Success:', values);
    return values
  } catch (errorInfo) {
    return false
  }
};


const getResourceTypeData = async () => {
  tableLoading.value = true;
  const result = await fetchAllResourceType().catch(e => e);
  tableLoading.value = false;
  if (!isSuccess(result)) {
    return message.error(result.message || '请求失败');
  }
  resourceTypeData.value = result.data
};

const addResourceType = () => {
  open.value = true;
  getResourceDataType()
};

const onClose = () => {
  open.value = false;
};

const submit = async () => {
  submitLoading.value = true;
  const result = await onCheck(formRef);
  if (!result) return submitLoading.value = false;
  const {attributes, info, name, description} = result
  const data = {
    resource_type: {
      name,
      info,
      description
    },
    attributes
  }
  const submitResult = await createResourceType(data).catch(e => e);
  if (!isSuccess(submitResult)) {
    submitLoading.value = false;
    return message.error(submitResult.message || '请求失败');
  }
  submitLoading.value = false;
  open.value = false;
  message.success('新增成功')
  getResourceTypeData()
};

const submitAddDataType = async () => {
  dataTypeLoading.value = true;
  const result = await onCheck(dataTypeFormRef);
  if (!result) return dataTypeLoading.value = false;
  const {name, info} = result
  const data = {
    name,
    info
  }
  const submitResult = await createDataType(data).catch(e => e);
  if (!isSuccess(submitResult)) {
    dataTypeLoading.value = false;
    return message.error(submitResult.message || '请求失败');
  }
  dataTypeLoading.value = false;
  open.value = false;
  message.success('新增成功')
  dataTypeForm.name = ''
  dataTypeForm.info = ''
  getResourceDataType()
};

const addResourceDataType = () => {
  dataTypeOpen.value = true;
  getResourceDataType()
};

const getResourceDataType = async () => {
  const result = await fetchAllDataType().catch(e => e);
  if (!isSuccess(result)) {
    return message.error(result.message || '请求失败');
  }
  resourceDataTypeData.value = result.data
}

const confirmDelete = async ({resource_type}) => {
  const result = await deleteResourceType(resource_type.id).catch(e => e);
  if (!isSuccess(result)) {
    return message.error(result.message || '请求失败');
  }
  message.success('删除成功')
  getResourceTypeData()
}

const confirmDeleteDataType = async ({id}) => {
  const result = await deleteDataType(id).catch(e => e);
  if (!isSuccess(result)) {
    return message.error(result.message || '请求失败');
  }
  message.success('删除成功')
  getResourceDataType()
}

onMounted(() => {
  getResourceTypeData();
});

watch(
    () => open.value,
    (value) => {
      if (value) {
        formRef.value?.resetFields()
        dynamicValidateForm.attributes = []
      }
    },
)
watch(
    () => dataTypeOpen.value,
    (value) => {
      if (value) {
        dataTypeFormRef.value?.resetFields()
        dataTypeForm.info = ''
        dataTypeForm.name = ''
      }
    },
)
</script>
