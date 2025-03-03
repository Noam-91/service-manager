const handleGeneratePDF = async (reportData) => {
  try {
    const html = generateHTML(reportData);
    const res = await wx.cloud.callFunction({
      name: 'generate-pdf',
      data: {
        htmlContent: html,
        fileName: `报告-${reportData.job_id}.pdf`
      }
    });
    wx.showModal({
      title: '生成成功',
      content: 'PDF 已生成，是否下载？',
      success: () => {
        wx.downloadFile({
          url: res.result.pdfUrl,
          success: (downloadRes) => {
            wx.openDocument({ filePath: downloadRes.filePath });
          }
        });
      }
    });
  } catch (err) {
    wx.showToast({ title: '生成失败', icon: 'none' });
  }
};

export {handleGeneratePDF};