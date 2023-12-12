<template>
  <div style="padding-bottom: 10px">
    <a-space>
      <a-button @click="addResource" type="primary">
        <template #icon>
          <PlusOutlined/>
        </template>
        新增资源
      </a-button>
      <a-input-search
          allow-clear
          enter-button
          @search="fetchResourceData"
          v-model:value="resourceId"
          style="width: 200px"
          placeholder="请输入资源类型ID"
      />
    </a-space>
  </div>
  <a-table
      :columns="resourceColumns"
      :data-source="resourceData"
      :loading="tableLoading"
  >
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'action'">
        <a-popconfirm
            title="是否确认删除该资源？"
            ok-text="确认"
            cancel-text="取消"
            @confirm="()=> confirmDelete(record)"
        >
          <a-button type="link" danger>删除</a-button>
        </a-popconfirm>
      </template>
      <template v-else-if="column.dataIndex === 'attributes_values'">
          <div v-for="(value, key) in record['attributes_values']" :key="value">
            <span>{{ key }}：</span>
            <span>{{ value }}</span>
          </div>
      </template>
      <template v-else-if="column.dataIndex === 'date'">
        <span>2023/12/10 15:12:00</span>
      </template>
      <span v-else>
          {{ text }}
      </span>
    </template>
  </a-table>
  <a-drawer
      v-model:open="open"
      title="新增资源"
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
    >
      <a-form-item
          :rules="{required: true,message: '缺少资源名称',}"
          label="资源名称" name="name">
        <a-input
            v-model:value="dynamicValidateForm.name"
        />
      </a-form-item>
      <a-form-item
          :rules="{required: true,message: '缺少资源描述',}"
          label="资源描述" name="description">
        <a-input
            v-model:value="dynamicValidateForm.description"
        />
      </a-form-item>
      <a-form-item
          name="type_id"
          :rules="{required: true,message: '缺少资源属性类型',}"
          label="资源类型"
      >
        <a-select
            v-model:value="dynamicValidateForm.type_id"
            :options="resourceTypeOptions"
            @change="changeDataType"
            placeholder="请选择资源属性类型"
        ></a-select>
      </a-form-item>
      <a-form-item
          v-for="(item, index) in resourceTypeAttributes"
          :key="index"
          :label="item.info"
          :name="['attributes_values', item.name]"
          :rules="[{ required: true, validator: (rule, value)=>checkAttribute(value, item.data_type_name), trigger: 'blur' }]"
      >
        <a-input
            v-if="item.data_type_name === 'string'"
            v-model:value="dynamicValidateForm.attributes_values[item.name]"
        />
        <a-input-number
            style="width: 100%"
            v-else-if="item.data_type_name === 'int'"
            v-model:value="dynamicValidateForm.attributes_values[item.name]"
        />
        <a-input-number
            style="width: 100%"
            v-else-if="item.data_type_name === 'float'"
            v-model:value="dynamicValidateForm.attributes_values[item.name]"
        />
        <a-input-number
            style="width: 100%"
            v-else-if="item.data_type_name === 'double'"
            v-model:value="dynamicValidateForm.attributes_values[item.name]"
        />
        <a-input-number
            style="width: 100%"
            v-else-if="item.data_type_name === 'long'"
            v-model:value="dynamicValidateForm.attributes_values[item.name]"
        />
        <a-input
            v-else-if="item.data_type_name === 'boolean'"
            v-model:value="dynamicValidateForm.attributes_values[item.name]"
        />
      </a-form-item>
    </a-form>
  </a-drawer>
</template>
<script setup lang="ts">
import { onMounted, ref, reactive, watch, computed } from "vue";
import {
  createResource,
  deleteResource,
  fetchAllDataType,
  fetchAllResources,
  fetchAllResourceType, fetchResource
} from "@/api/resource";
import { isSuccess } from "@/utils";
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';
import { resourceColumns } from "@/constants/constant";
import { useRouter } from "vue-router";

const router = useRouter()


const resourceData = ref<any[]>([]);
const resourceTypeData = ref<any[]>([]);
const dataType = ref<any[]>([]);
const tableLoading = ref<boolean>(false);
const submitLoading = ref<boolean>(false);
const open = ref<boolean>(false);
const resourceId = ref()

const resourceTypeOptions = computed(() => {
  return resourceTypeData.value.map(item => {
    return {
      label: item.resource_type.name,
      value: item.resource_type.id
    }
  })
})

const resourceTypeAttributes = computed(() => {
  const resourceType = resourceTypeData.value.find(item => item.resource_type.id === dynamicValidateForm.type_id)
  return resourceType?.attributes || []
})


interface ResourceType {
  name: string;
  description: string;
  type_id: '',
  attributes_values: Record<string, any>
}

const formRef = ref<FormInstance>();
const dynamicValidateForm = reactive<ResourceType>({
  name: '',
  description: '',
  type_id: undefined,
  attributes_values: {},
});


const onCheck = async (outRef) => {
  try {
    const values = await outRef.value.validateFields();
    console.log('Success:', values);
    return values
  } catch (errorInfo) {
    return false
  }
};

const checkAttribute = (value, dataType) => {
  if (!value) return Promise.reject('必填');
  if (dataType === 'int') {
    if (!Number.isInteger(value)) {
      return Promise.reject('只能是整数');
    }
  }
  if (dataType === 'float' || dataType === 'double') {
    if (typeof value !== 'number') {
      return Promise.reject('只能是数字');
    }
  }
  if (dataType === 'boolean') {
    if (value !== 'true' && value !== 'false') {
      return Promise.reject('只能是布尔值，true或者false');
    }
  }
  return Promise.resolve();
}


const changeDataType = (value) => {
  console.log(value)
}

const getAllResourceData = async () => {
  tableLoading.value = true;
  const result = await fetchAllResources().catch(e => e);
  tableLoading.value = false;
  if (!isSuccess(result)) {
    return message.error(result.message || '请求失败');
  }
  resourceData.value = result.data
};

const fetchResourceData = async () => {
  if (!resourceId.value) return getAllResourceData()
  tableLoading.value = true;
  const result = await fetchResource(resourceId.value).catch(e => e);
  tableLoading.value = false;
  if (!isSuccess(result)) {
    return message.error(result.message || '请求失败');
  }
  resourceData.value = result.data
};

const getResourceTypeData = async () => {
  tableLoading.value = true;
  const result = await fetchAllResourceType().catch(e => e);
  await getResourceDataType().catch(e => e);
  tableLoading.value = false;
  if (!isSuccess(result)) {
    return message.error(result.message || '请求失败');
  }
  resourceTypeData.value = result.data?.map(item => {
    item.attributes = item.attributes.map(attribute => {
      const dataTypeItem = dataType.value.find(dataTypeItem => dataTypeItem.id === attribute.data_type)
      return {
        ...attribute,
        data_type_name: dataTypeItem?.name
      }
    })
    return item
  })
  console.log(resourceTypeData.value)
};

const addResource = () => {
  open.value = true;
  getResourceTypeData()
};

const onClose = () => {
  open.value = false;
};

const submit = async () => {
  submitLoading.value = true;
  const result = await onCheck(formRef);
  if (!result) return submitLoading.value = false;
  const {attributes_values, type_id, name, description} = result
  const data = {
    name,
    description,
    type_id,
    attributes_values
  }
  const submitResult = await createResource(data).catch(e => e);
  if (!isSuccess(submitResult)) {
    submitLoading.value = false;
    return message.error(submitResult.message || '请求失败');
  }
  submitLoading.value = false;
  open.value = false;
  message.success('新增成功')
  getAllResourceData()
};

const getResourceDataType = async () => {
  const result = await fetchAllDataType().catch(e => e);
  if (!isSuccess(result)) {
    return message.error(result.message || '请求失败');
  }
  dataType.value = result.data
}

const confirmDelete = async ({id}) => {
  const result = await deleteResource(id).catch(e => e);
  if (!isSuccess(result)) {
    return message.error(result.message || '请求失败');
  }
  message.success('删除成功')
  getAllResourceData()
}


onMounted(() => {
  console.log(router.currentRoute.value)
  const {query} = router.currentRoute.value || {}
  if (query.resource_type_id) {
    resourceId.value = query.resource_type_id
    fetchResourceData()
  } else {
    getAllResourceData();
  }
});

watch(
    () => open.value,
    (value) => {
      if (value) {
        formRef.value?.resetFields()
        dynamicValidateForm.name = ''
        dynamicValidateForm.description = ''
        dynamicValidateForm.type_id = undefined
        dynamicValidateForm.attributes_values = {}
      }
    },
)
</script>
