/*$(document).ready(function (){

});*/
(function() {
    // 创建一个全局的 toast 函数
    window.showToast = function(message, duration = 2000) {
        // 如果已经存在一个 toast，先移除它
        const existingToast = document.querySelector('.custom-toast');
        if (existingToast) {
            existingToast.remove();
        }

        // 创建一个新的 toast 元素
        const toast = document.createElement('div');
        toast.classList.add('custom-toast');
        toast.textContent = message;

        // 设置样式
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        toast.style.color = 'white';
        toast.style.padding = '10px 15px';
        toast.style.borderRadius = '5px';
        toast.style.zIndex = '9999';
        toast.style.maxWidth = '80%';
        toast.style.textAlign = 'center';
        toast.style.fontSize = '14px';

        // 添加到文档中
        document.body.appendChild(toast);

        // 设置自动消失
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300); // 等待动画结束
        }, duration);
    };
})();

let encryptor = new JSEncrypt()
encryptor.setPublicKey(
    '-----BEGIN PUBLIC KEY-----'+
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDACwPDxYycdCiNeblZa9LjvDzb'+
    'iZU1vc9gKRcG/pGjZ/DJkI4HmoUE2r/o6SfB5az3s+H5JDzmOMVQ63hD7LZQGR4k'+
    '3iYWnCg3UpQZkZEtFtXBXsQHjKVJqCiEtK+gtxz4WnriDjf+e/CxJ7OD03e7sy5N'+
    'Y/akVmYNtghKZzz6jwIDAQAB'+
    '-----END PUBLIC KEY-----'
)

//打开地址
function openUrl(url) {
    window.open(url);
}

function shoudIspSel() {
    if("GZ_HOT_SOFT_TECHNOLOGY"==appId){
        return true;
    }
    return false;
}

function getSecretParam (p)  {
    if(p === null || p === undefined || p.trim() === ''){
        return '';
    }
    let arr = []
    let maxIndex = 0
    for (let i = 0; i <= p.length; i++) {
        if ((i + 1) % 30 === 0) {
            arr.push(encodeURI(encryptor.encrypt(p.substring(maxIndex, i))))
            maxIndex = i
        }
    }
    maxIndex !== p.length &&
    arr.push(
        encodeURI(encryptor.encrypt(p.substring(maxIndex, p.length)))
    )
    return encodeURIComponent(JSON.stringify(arr))
}

function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    // return arr
    if (arr != null) {
        return unescape(arr[2])
    } else {
        return null
    }
}


function addParamToUrl(url, paramKey, paramValue) {
    if (url.includes('?')) {
        // 如果URL已经有其他参数，则在末尾添加新参数
        url = url.replace(/&+$/, '') + '&' + paramKey + '=' + paramValue;
    } else {
        // 如果URL没有其他参数，则直接添加参数
        url += '?' + paramKey + '=' + paramValue;
    }
    return url;
}

function getVerifyCode(el) {
     $(el).attr("src",serverUrl + "/getVerifyCode?random=" + Math.random());
}

function getQueryString(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}