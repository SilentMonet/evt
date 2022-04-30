console.log('run content scripts at document start：alert');
if (location.hostname.includes('shopee')) {
  alert("content script");
}