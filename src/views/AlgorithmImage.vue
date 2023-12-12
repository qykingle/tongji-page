<template>
     <a-form layout="inline">
            <a-form-item>
                <a-input placeholder="搜索关键词" v-model="searchKey" @change="searchKeyOnchange"
                         v-focus
                         style="width: 400px">
                    <a-icon slot="prefix" type="search" style="color:rgba(0,0,0,.25)"/>
                </a-input>
            </a-form-item>

            <a-form-item>
                <a-space>
                    <a-button html-type="reset" @click="reloadImageList">
                        <ReloadOutlined />
                        刷新
                    </a-button>

                    <a-button @click="pullImage">
                        <CloudDownloadOutlined />
                        拉取
                    </a-button>

                    <a-button @click="importImageVisible = true" type="primary">
                        <CloudUploadOutlined />
                        导入
                    </a-button>

                </a-space>
            </a-form-item>
        </a-form>

        <a-modal v-model:open="importImageVisible" title="导入新的镜像" @ok="closeImportImageVisible">
            <a-upload
                v-model:file-list="fileList"
                name="file"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                :headers="headers"
                @change="handleChange"
            >
                <a-button>
                    <upload-outlined></upload-outlined>
                    选择文件上传
                </a-button>
            </a-upload>
        </a-modal>


</template>


<script lang="ts" setup>
import { onMounted, ref, reactive, watch, computed } from "vue";
import { message, UploadChangeParam} from 'ant-design-vue';
import {
    ReloadOutlined,
    CloudDownloadOutlined,
    CloudUploadOutlined,
    UploadOutlined 
} from '@ant-design/icons-vue';

const pullImageVisible = ref<boolean>(false);
const importImageVisible = ref<boolean>(false);
const showDetail = ref<boolean>(false);

const reloadImageList = () => {
    message.success(`刷新列表成功`);
}

const pullImage = () => {
    pullImageVisible.value = true; 
}

const closeImportImageVisible = () => {
    importImageVisible.value = false;
}

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (info.file.status === 'done') {
    message.success(`${info.file.name} file uploaded successfully`);
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
};

const fileList = ref([]);
const headers = {
  authorization: 'authorization-text',
};

</script>

<style scoped>
    .ant-drawer-body {
        padding: 0 !important;
    }


    .configTable, .configTable tr th, .configTable tr td {
        border: 1px solid lightgrey;
    }

    .configTable .tagTd {
        width: 100px;
    }

    .configTable {
        width: 100%;
        margin-top: 20px;
        text-align: center;
        border-collapse: collapse;
    }

    .contentTd {
        overflow-wrap: anywhere;
        padding: 5px 0 5px 10px;
    }

    .pullLog {
        overflow-y: auto;
        overflow-x: auto;
        height: 300px;
        background-color: #EFEFEF;
    }
</style>
