<template>
  <div>
    <iframe
      id="iframe"
      src="http://139.224.82.63:9091/"
      style="width: 100%; height: calc(100vh - 20px);"
      frameborder="0"
      scrolling="no"
    ></iframe>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from "vue";

onMounted(() => {
    const timer = setInterval(() => {
      changeIframeStyle()
    }, 1000)
    onBeforeUnmount(() => {
        clearInterval(timer)
    })
})



const changeIframeStyle = () => {
    const iframe= document.getElementById('iframe') as HTMLIFrameElement;
    console.log();
    
    if (iframe) {
      const iframeDocument = iframe.contentDocument;
      
      if (iframeDocument) {
        const elementToRemove = iframeDocument.querySelector('head');
        console.log("=========", elementToRemove);
        
        if (elementToRemove) {
          elementToRemove.remove();
        }
      }
     
    }
}
</script>