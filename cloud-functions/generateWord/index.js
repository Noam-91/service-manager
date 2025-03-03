const cloud = require('wx-server-sdk')
const Docxtemplater = require('docxtemplater')
const PizZip = require('pizzip')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { jsonData } = event 

  // 1. Read Template
  const templateRes = await cloud.downloadFile({
    fileID: `cloud://service-manager-8gmqx1il4b088769.7365-service-manager-8gmqx1il4b088769-1344634018/Service_Report_docxtemplater.docx`
  })
  const buffer = templateRes.fileContent

  // 2. Initiate docxtemplater
  const zip = new PizZip(buffer)
  const doc = new Docxtemplater(zip, { paragraphLoop: true })

  // 3. Fill data
  try {
    doc.render(JSON.parse(jsonData));
  } catch (e) {
    throw new Error(`模板渲染失败: ${e.message}`)
  }

  // 4. Convert to Base64
  const outputBuffer = doc.getZip().generate({ type: 'nodebuffer' })
  const base64Data = outputBuffer.toString('base64')
  return {
    fileBase64: base64Data,
    fileName: `service report_${Date.now()}.docx`
  }
}