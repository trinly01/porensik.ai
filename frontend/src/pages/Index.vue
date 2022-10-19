<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" style="max-width: 200px; opacity: 0.5;" src="~assets/box.png">
    <div class="q-pr-xl q-pl-xl text-justify text-body1 "
      style="position: relative; bottom: 170px; text-indent: 50px">
      {{ $host === 'http://10.10.120.15:3232' ? eIMIS : KMS }}
    </div>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  data: () => ({
    KMS: `
      A powerful system that uses artificial intelligence to search for texts in images/videos, spoken words, faces and objects instantly. In this way, it allows officers and detectives to speed up the entire process of investigation and to focus more on the actual analysis of relevant information. 

      Documents, PDFs, Audio, Photos, Video, Face and Object Detection

      law enforcement agencies must have a complete digital evidence management system that can auto-ingest the evidence from various sources and support multiple formats to provide a centralized portal for storage, protection, and analysis.
    `,
    eIMIS: `
      A powerful system that uses artificial intelligence to search for texts in images/videos, spoken words, faces and objects instantly. In this way, it allows officers and detectives to speed up the entire process of investigation and to focus more on the actual analysis of relevant information. 

      Documents, PDFs, Audio, Photos, Video, Face and Object Detection

      law enforcement agencies must have a complete digital evidence management system that can auto-ingest the evidence from various sources and support multiple formats to provide a centralized portal for storage, protection, and analysis.
    `,
  }),
  mounted () {
    console.log('INDEX', this.$route)
  }
}
</script>
