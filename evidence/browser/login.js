// 函数：检测内容是否超出宽度
function checkOverflow(container, el, item) {
    //console.log(container, el, item)
    // 检查文本是否被省略
    const isTextTruncated = el => {
        const clone = el.cloneNode(true)
        clone.style.width = 'auto'
        clone.style.whiteSpace = 'normal'
        clone.style.position = 'absolute'
        clone.style.visibility = 'hidden'
        container.appendChild(clone)
        const originalWidth = el.offsetWidth
        const cloneWidth = clone.offsetWidth
        container.removeChild(clone)
        return cloneWidth > originalWidth
    }
    // 初始化时检查是否需要显示工具提示
    if (isTextTruncated(el)) {
        // console.log(isTextTruncated(el))
        // 设置原始文本为元素的data属性
        el.setAttribute('data-fulltext', item.message)
        // 创建并配置tooltip元素
        const tooltip = document.createElement('div')
        tooltip.className = 'tooltip'
        tooltip.textContent = item.message
        // 鼠标进入事件
        const showTooltip = () => {
            tooltip.style.position = 'fixed'
            tooltip.style.left = `${el.getBoundingClientRect().left + el.offsetWidth - 200}px`
            tooltip.classList.add('visible')
            tooltip.style.top = `${el.getBoundingClientRect().top + window.scrollY - tooltip.offsetHeight - 10}px`
        }
        // 鼠标离开事件
        const hideTooltip = () => {
            tooltip.classList.remove('visible')
        }
        //console.log(tooltip)
        el.appendChild(tooltip)
        el.addEventListener('mouseenter', showTooltip)
        el.addEventListener('mouseleave', hideTooltip)
    }
}
// 通知公告点击事件--start
function warningClick(startPage) {
    if (startPage < 1) {
        return
    }

    let container
    // 获取容器元素

    if (loginStyle === 'one' || loginStyle === 'five') {
        container = document.getElementById('oneUl');
    } else {
        console.log('372')
        container = document.getElementById('twoUl')
    }

    //拉取通知公告
    simpleAxios({
        url: serverUrl + '/notice/pageNotice?pageNum=' + startPage + '&pageSize=4',
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (res) {
            // res.data=res
            if (200 == res.code) {
                // 要添加的内容示例数组
                console.log(res.content.list)
                const noteList = res.content.list
                const items = []
                if (noteList && noteList.length > 0) {
                    //当前页写入
                    noticeCurrentPage = res.content.pageNum
                    noticeMaxPage = Math.ceil(res.content.total / res.content.pageSize)
                    //alert(noticeMaxPage)
                    //清空容器
                    container.innerHTML = ''
                    noteList.forEach(item => {
                        items.push({ message: item.title, url: item.url })
                    })
                }

                // 使用 for 循环添加内容
                items.forEach(item => {
                    // 创建一层 div
                    const oneLi = document.createElement('div')
                    oneLi.className = 'two-li' // 添加类名
                    // 创建左边的 div
                    const oneLiLeft = document.createElement('div')
                    oneLiLeft.className = 'two-li-left' // 添加类名
                    // 创建右边的 div
                    const oneLiRight = document.createElement('div')
                    oneLiRight.className = 'two-li-right text1' // 添加类名
                    oneLiRight.textContent = item.message // 设置内容
                    // 为整个条目添加点击事件
                    oneLi.addEventListener('click', () => {
                        window.open(item.url) // 点击时跳转到对应的 URL
                    })
                    // 将左右 div 添加到一层 div 中
                    oneLi.appendChild(oneLiLeft)
                    oneLi.appendChild(oneLiRight)
                    // 将一层 div 添加到容器中
                    container.appendChild(oneLi)
                    //增加悬浮
                    console.log('增加悬浮')
                    console.log(oneLiRight)
                    setTimeout(() => {
                        checkOverflow(container, oneLiRight, item)
                    })
                })
                // 通知公告点击事件--end
            } else {
                console.log('拉取公告失败')
            }
        })
        .catch(function (err) {
            console.log(err)
        })
}

function noticePage(obj) {
    let tempPage
    if (obj == 'before') {
        tempPage = noticeCurrentPage - 1
    } else {
        tempPage = noticeCurrentPage + 1
    }
    if (tempPage > 0 && tempPage <= noticeMaxPage) {
        warningClick(tempPage)
    }
}

// 导航项点击事件+表单验证+协议与隐私政策--start
function menuClick() {
    // 模拟菜单数据
    const menuItems = [{ title: '账号登录', path: 'A' }]

    if (smsEnable == 'ON') {
        menuItems.push({ title: '短信登录', path: 'B' })
    }

    if (scanEnable == 'ON') {
        menuItems.push({ title: '扫码登录', path: 'C' })
    }

    if (faceEnable == 'ON') {
        menuItems.push({ title: '人脸登录', path: 'D' })
    }

    let menuListElement
    // 菜单

    if (loginStyle === "one" || loginStyle === "five") {
        menuListElement = document.getElementById('onemenuList');
    } else {
        menuListElement = document.getElementById('menuList')
    }
    const ApasswordLogin = document.getElementById('ApasswordLogin')
    const BpasswordLogin = document.getElementById('BpasswordLogin')
    // 创建菜单项
    menuItems.forEach((item, index) => {
        const li = document.createElement('li')
        li.className = 'TopmenuLi'
        li.textContent = item.title

        // 添加点击事件
        li.addEventListener('click', () => {
            select = item.path
            // 移除所有项的高亮
            const allItems = document.querySelectorAll('.TopmenuLi')
            allItems.forEach(menu => menu.classList.remove('Topactive'))

            // 添加当前项的高亮

            li.classList.add('Topactive');
            clearErrors(); // 清除之前的错误信息
            if (loginStyle === "one" || loginStyle === "five") {
                if (item.path === 'A') {
                    oneApasswordLogin.style.display = 'block'
                    oneBpasswordLogin.style.display = 'none'
                    oneCpasswordLogin.style.display = 'none'
                    oneDpasswordLogin.style.display = 'none'
                    oneqrcode.style.display = 'flex'
                } else if (item.path === 'B') {
                    oneApasswordLogin.style.display = 'none'
                    oneBpasswordLogin.style.display = 'block'
                    oneCpasswordLogin.style.display = 'none'
                    oneDpasswordLogin.style.display = 'none'
                    oneqrcode.style.display = 'flex'
                } else if (item.path === 'C') {
                    oneApasswordLogin.style.display = 'none'
                    oneBpasswordLogin.style.display = 'none'
                    oneCpasswordLogin.style.display = 'block'
                    oneDpasswordLogin.style.display = 'none'
                    oneqrcode.style.display = 'none'
                } else if (item.path === 'D') {
                    oneApasswordLogin.style.display = 'none'
                    oneBpasswordLogin.style.display = 'none'
                    oneCpasswordLogin.style.display = 'none'
                    oneDpasswordLogin.style.display = 'block'
                    oneqrcode.style.display = 'none'
                }
            } else {
                if (item.path === 'A') {
                    ApasswordLogin.style.display = 'block'
                    BpasswordLogin.style.display = 'none'
                    CpasswordLogin.style.display = 'none'
                    DpasswordLogin.style.display = 'none'
                    qrcode.style.display = 'flex'
                } else if (item.path === 'B') {
                    ApasswordLogin.style.display = 'none'
                    BpasswordLogin.style.display = 'block'
                    CpasswordLogin.style.display = 'none'
                    DpasswordLogin.style.display = 'none'
                    qrcode.style.display = 'flex'
                } else if (item.path === 'C') {
                    ApasswordLogin.style.display = 'none'
                    BpasswordLogin.style.display = 'none'
                    CpasswordLogin.style.display = 'flex'
                    DpasswordLogin.style.display = 'none'
                    qrcode.style.display = 'none'
                } else if (item.path === 'D') {
                    ApasswordLogin.style.display = 'none'
                    BpasswordLogin.style.display = 'none'
                    CpasswordLogin.style.display = 'none'
                    DpasswordLogin.style.display = 'flex'
                    qrcode.style.display = 'none'
                }
            }

            // 跳转到相应的路径
            // window.location.href = item.path;
            //二维码渲染

            if(loginStyle === "one" || loginStyle === "five"){
                if(item.path === 'C'){
                    //渲染二维码
                    creatQrCode('oneQrcodeID')
                } else if (item.path === 'D') {
                    //渲染二维码
                    creatQrCode('faceOneQrcodeID')
                }
            } else {
                if (item.path === 'C') {
                    //渲染二维码
                    creatQrCode('QrcodeID')
                } else if (item.path === 'D') {
                    creatQrCode('FaceQrcodeID')
                }
            }
        })

        // 将新菜单项添加到菜单列表中
        menuListElement.appendChild(li)

        // 初始化时高亮第一项
        if (index === 0) {
            li.classList.add('Topactive') // 为第一项添加高亮类
        }
    })
    // 导航项点击事件--end

    let formRef
    //form表单验证方法--start

    if (loginStyle === "one" || loginStyle === "five") {
        console.log('one')
        formRef = document.getElementById('oneloginForm')
    } else {
        console.log('two')
        formRef = document.getElementById('loginForm')
    }
    //console.log(formRef)
    formRef.addEventListener('submit', function (event) {
        //账号密码提交
        if (select === 'A') {
            event.preventDefault() // 阻止默认提交行为
            clearErrors() // 清除之前的错误信息
            let username, password
            if (loginStyle === "one" || loginStyle === "five") {
                username = document.getElementById('oneusername').value.trim();
                password = document.getElementById('onepassword').value.trim();
            } else {
                username = document.getElementById('username').value.trim()
                password = document.getElementById('password').value.trim()
            }

            const YES = document.getElementById('YES')
            const dialogContent = document.getElementById('dialogContent')
            let isValid = true

            // 验证用户名是否为空
            if (username === '') {
                if (loginStyle === "one" || loginStyle === "five") {
                    showError('oneusernameError', '账号不能为空');
                } else {
                    showError('usernameError', '账号不能为空')
                }

                isValid = false
            }
            // 验证密码是否为空
            if (password === '') {
                if (loginStyle === "one" || loginStyle === "five") {
                    showError('onepasswordError', '密码不能为空');
                } else {
                    showError('passwordError', '密码不能为空')
                }

                isValid = false
            }
            if (username === '' || password === '') {
                return
            }
            // 验证密码是否为空
            if (oneYES.style.display === 'none' && (loginStyle === "one" || loginStyle === "five") || YES.style.display === 'none' && loginStyle !== "one" && loginStyle !== "five") {
                dialogContent.style.display = 'flex';
                isValid = false;
            }

            // 如果验证通过

            if (isValid) {
                //校验是否需要输入验证码
                if (passwordVerifyCodeEnable == 'ON') {
                    console.log('显示验证码弹窗')
                    //需要输入验证码
                    checkContent.style.display = 'flex'
                    document.getElementById('codeInput1').focus()
                    //模拟一次点击拿到验证码
                    $('#checkImg>img').click()
                    return
                }

                // document.getElementById('formMessage').textContent = '登录成功！';
                // 这里可以执行实际的登录请求，例如通过 AJAX 发送到服务器
                // document.getElementById('loginForm').submit(); // 可解除注释进行提交
                let data = {
                    name: username,
                    pwd: getSecretParam(password),
                    //verifyCode: _this.form.verifyCode,
                    universityId: universityId,
                    loginType: loginType
                }
                ssoLogin(data)
            }
        } else if (select === 'B') {
            event.preventDefault() // 阻止默认提交行为
            clearErrors() // 清除之前的错误信息
            let phone, code
            if (loginStyle === "one" || loginStyle === "five") {
                phone = document.getElementById('onephone').value.trim();
                code = document.getElementById('onecode').value.trim();
            } else {
                phone = document.getElementById('phone').value.trim()
                code = document.getElementById('code').value.trim()
            }

            const YES = document.getElementById('YES')
            const dialogContent = document.getElementById('dialogContent')
            let isValid = true

            // 验证手机号是否为空
            if (phone === '') {
                if (loginStyle === "one" || loginStyle === "five") {
                    showError('oneBphoneError', '手机号不能为空');
                } else {
                    showError('BphoneError', '手机号不能为空')
                }

                isValid = false
            }
            const regex = /^1[3-9]\d{9}$/ // 中国大陆手机号正则，以1开头，第二位是3-9，接下来是9位数字
            if (!regex.test(phone && phone.trim())) {
                if (loginStyle === "one" || loginStyle === "five") {
                    showError('oneBphoneError', '手机号有误');

                } else {
                    showError('BphoneError', '手机号有误')
                }
                return
            }
            // 验证验证码是否为空
            if (code === '') {
                if (loginStyle === "one" || loginStyle === "five") {
                    showError('oneBpasswordError', '验证码不能为空');
                } else {
                    showError('BpasswordError', '验证码不能为空')
                }

                isValid = false
            }
            if (phone === '' || code === '') {
                return
            }
            // 验证密码是否为空
            if (oneYES.style.display === 'none' && (loginStyle === "one" || loginStyle === "five") || YES.style.display === 'none' && loginStyle !== "one" && loginStyle !== "five") {
                dialogContent.style.display = 'flex';
                isValid = false;
            }
            // 如果验证通过
            if (isValid) {
                console.log('验证通过')
                // document.getElementById('formMessage').textContent = '登录成功！';
                // 这里可以执行实际的登录请求，例如通过 AJAX 发送到服务器
                // document.getElementById('loginForm').submit(); // 可解除注释进行提交
                let data = {
                    name: phone,
                    verifyCode: code,
                    universityId: universityId,
                    inSideLoginType: 'PHONE_CODE',
                    loginType: loginType
                }
                ssoLogin(data)
            }
        }
    })

    //  form表单验证方法--end
    // 协议与隐私政策点击事件及方法--start
    // 获取图片元素
    let noImage, yesImage


    if (loginStyle === "one" || loginStyle === "five") {
        noImage = document.getElementById('oneNO');
        yesImage = document.getElementById('oneYES');

    } else {
        noImage = document.getElementById('NO')
        yesImage = document.getElementById('YES')
    }

    const closeDig = document.getElementById('closeDig')
    const cancleDig = document.getElementById('cancleDig')
    const confirmDig = document.getElementById('confirmDig')
    // 添加点击事件监听器
    noImage.addEventListener('click', function () {
        // 点击 NO 图片时显示 YES 图片，并隐藏 NO 图片
        noImage.style.display = 'none'
        yesImage.style.display = 'block'
    })

    yesImage.addEventListener('click', function () {
        // 点击 YES 图片时显示 NO 图片，并隐藏 YES 图片
        yesImage.style.display = 'none'
        noImage.style.display = 'block'
    })
    // 添加点击事件监听器
    closeDig.addEventListener('click', function () {
        dialogContent.style.display = 'none'
    })
    // 点击取消按钮时隐藏对话框
    cancleDig.addEventListener('click', function () {
        dialogContent.style.display = 'none'
    })
    // 点击确认按钮时隐藏对话框并显示 NO 图片
    confirmDig.addEventListener('click', function () {
        dialogContent.style.display = 'none';
        yesImage.style.display = 'block';
        noImage.style.display = 'none';
        if (loginStyle === "one" || loginStyle === "five") {
            document.getElementById('onesubmit').click();
        } else {
            document.getElementById('submit').click()
        }
    })
    // 协议与隐私政策点击事件及方法--end
}

//底部菜单点击事件--start
function bottomMenuClick() {
    let bottomMenu
    if (loginStyle === "one" || loginStyle === "five") {
        bottomMenu = document.getElementById('onebottomMenu');
    } else {
        bottomMenu = document.getElementById('bottomMenu')
    }

    //拉取外链信息
    $.ajax({
        url: serverUrl + '/notice/outsideLink?pageNum=1&pageSize=100',
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
        success: function (res) {
            if (200 == res.code) {
                // 要添加的内容示例数组
                console.log(res.content.list)
                const noteList = res.content.list
                const bottomItems = []
                if (noteList && noteList.length > 0) {
                    noteList.forEach(item => {
                        bottomItems.push({
                            message: item.title,
                            url: item.url
                        })
                    })
                }

                // 菜单
                // 创建菜单项
                bottomItems.forEach((item, index) => {
                    const li = document.createElement('li');
                    if (loginStyle === "one" || loginStyle === "five") {
                        li.className = 'bottomMenuLi';
                        bottomMenu.classList.add('bottomMenu');
                    } else {
                        li.className = 'twobottomMenuLi'
                        bottomMenu.classList.add('twobottomMenu')
                    }
                    li.textContent = item.message

                    // 添加点击事件
                    li.addEventListener('click', () => {
                        // 跳转到相应的路径
                        window.location.href = item.url
                    })

                    // 将新菜单项添加到菜单列表中
                    bottomMenu.appendChild(li)
                })
            } else {
                console.log('拉取外链失败')
                showMessage('拉取外链失败', 'error')
            }
        },
        error: function (xhr, status, error) {
            console.log(error)
            showMessage(error, 'error')
        }
    })

    function adoptDevice() {
        console.log('adoptDevice', document.documentElement.clientWidth)
        const baseWidth = 1920 // 设计稿宽度
        const htmlWidth = document.documentElement.clientWidth
        const scale = htmlWidth / baseWidth
        let zoomLevel = window.devicePixelRatio || 1
        if (zoomLevel > window.outerWidth / window.innerWidth) {
            zoomLevel = window.outerWidth / window.innerWidth || 1 // 高清屏
        }
        console.log('...', scale, window.devicePixelRatio, window.outerWidth, window.innerWidth)
        var size = scale * zoomLevel * 16
        // 确保字体大小不小于12px
        size = Math.max(size, 12)
        // 设置根元素的字体大小
        document.documentElement.style.fontSize = `${size}px`
    }

    // 检查窗口宽度并更新HTML类名和样式
    function checkWindowWidth() {
        const windowWidth = window.innerWidth
        console.log('检查窗口宽度:', windowWidth)
        if (windowWidth <= 1000) {
            document.documentElement.classList.add('window-small')
            console.log('添加window-small类')

            // 隐藏轮播图
            const lunbotuStyle = document.getElementById('lunbotu')
            if (lunbotuStyle) {
                lunbotuStyle.style.display = 'none'
                console.log('隐藏轮播图')
            }
            // 隐藏左侧内容
            const oneLoginContentLeft = document.querySelector('.one-login-content-left')
            if (oneLoginContentLeft) {
                oneLoginContentLeft.style.display = 'none'
                console.log('隐藏one-login-content-left')
            }
            const twoLoginContentLeft = document.querySelector('.two-login-content-left')
            if (twoLoginContentLeft) {
                twoLoginContentLeft.style.display = 'none'
                console.log('隐藏two-login-content-left')
            }
        } else {
            document.documentElement.classList.remove('window-small')
            console.log('移除window-small类')

            // 恢复轮播图
            const lunbotuStyle = document.getElementById('lunbotu')
            if (lunbotuStyle) {
                lunbotuStyle.style.display = 'block'
                console.log('显示轮播图')
            }
            // 恢复左侧内容
            const oneLoginContentLeft = document.querySelector('.one-login-content-left')
            if (oneLoginContentLeft) {
                oneLoginContentLeft.style.display = 'block'
                console.log('显示one-login-content-left')
            }
            const twoLoginContentLeft = document.querySelector('.two-login-content-left')
            if (twoLoginContentLeft && loginStyle !== 'eight') {
                twoLoginContentLeft.style.display = 'block'
                console.log('显示two-login-content-left')
            }
        }
    }

    // 监听resize
    function updateFontSize() {
        let lastZoomLevel = window.devicePixelRatio || window.outerWidth / window.innerWidth
        window.addEventListener('resize', () => {
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
            let newZoomLevel = isSafari ? window.outerWidth / window.innerWidth : window.devicePixelRatio || 1

            if (lastZoomLevel !== newZoomLevel) {
                console.log('检测到缩放变化:', lastZoomLevel, '->', newZoomLevel)
                lastZoomLevel = newZoomLevel
                adoptDevice()
            } else {
                console.log('窗口大小改变')
                adoptDevice()
            }
            // 检查窗口宽度
            checkWindowWidth()
        })
        // 检查窗口宽度
        checkWindowWidth()
    }
    updateFontSize()
    adoptDevice()

    // 监听前进/后退以及load事件触发
    /*   window.addEventListener("pageshow", function (e) {
        if (e.persisted) { // 浏览器后退的时候重新计算
            refreshScale()
        }
    }, false);*/

    // 监听屏幕缩放
    /*  window.addEventListener("resize", function () {
        refreshScale()
    }, false);*/
    //轮播图
}

function showError(elementId, message) {
    console.log(elementId, message)
    document.getElementById(elementId).textContent = message
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.Error')
    errorElements.forEach(el => (el.textContent = ''))
    // document.getElementById('formMessage').textContent = '';
}

//轮播图
function lunbotuClick() {
    // 定义图片数组
    let images = [
        serverUrlStatic + '/purenative/images/login_Bg.png',
        serverUrlStatic + '/purenative/images/login_whiteBg.png',
        serverUrlStatic + '/purenative/images/login_whiteBg.png'
    ]

    if (loginPageCarouselImage) {
        loginPageCarouselImage = loginPageCarouselImage.replaceAll('&quot;', '"')
        images = JSON.parse(loginPageCarouselImage)
        console.log(images)
    }

    let currentSlide = 0 // 当前幻灯片索引
    const slides = document.querySelectorAll('.carousel-item')
    function moveSlide(index) {
        // 移动幻灯片
        const newTransformValue = -index * 100 // 计算新的 transform 值
        carousel.style.transform = `translateX(${newTransformValue}%)`
        // 更新按钮状态
        const buttons = document.querySelectorAll('.prev')
        buttons.forEach(button => button.classList.remove('next'))
        buttons[index].classList.add('next')
    }
    function showSlide(index) {
        // 确保索引在有效范围内
        currentSlide = index // 更新当前幻灯片索引
        // 移动幻灯片
        const newTransformValue = -currentSlide * 100 // 计算新的 transform 值
        carousel.style.transform = `translateX(${newTransformValue}%)`
    }

    // 获取轮播容器
    const carousel = document.querySelector('.carousel')
    // 获取按钮容器
    const buttonContainer = document.querySelector('.buttonALl')
    // 使用循环动态添加轮播项
    images.forEach((src, index) => {
        // 创建轮播项的 div
        const carouselItem = document.createElement('div')
        carouselItem.className = 'carousel-item' + (index === 0 ? ' active' : '') // 为第一项添加 active 类
        // 创建图片元素
        const imgContainer = document.createElement('div')
        imgContainer.className = 'image-container'
        const img = document.createElement('img')
        img.src = src // 设置图片来源
        img.alt = `Image ${index + 1}` // 设置图片 alt 属性
        img.className = 'image-containerImg' // 添加类名
        // 添加加载事件
        img.onload = function () {
            console.log(img.naturalWidth, img.naturalHeight)
            // 检查图片的宽高比并进行调整
            if (img.naturalWidth > img.naturalHeight) {
                if (ispSelEnable === 'YES') {
                    img.style.height = '34.375rem' // 设置固定高度
                } else {
                    img.style.height = '30.875rem' // 设置固定高度
                }
                img.style.width = 'auto' // 宽度自适应
            } else {
                img.style.width = '31rem' // 设置固定宽度
                img.style.height = 'auto' // 高度自适应
            }
        }
        // 将图片添加到容器
        imgContainer.appendChild(img)
        // 将容器添加到轮播项
        carouselItem.appendChild(imgContainer)
        // 将轮播项添加到轮播容器
        carousel.appendChild(carouselItem)
        // 循环生成按钮
        const buttonDiv = document.createElement('div')
        buttonDiv.className = 'prev' + (index === 0 ? ' next' : '') // 根据方向添加类名
        buttonDiv.onclick = () => moveSlide(index) // 绑定点击事件
        // 将生成的按钮添加到容器中
        buttonContainer.appendChild(buttonDiv)
        // 初始化展示第一个轮播图
        showSlide(currentSlide)
    })

    // 自动播放（可选）
    setInterval(() => {
        if (currentSlide === images.length - 1) {
            currentSlide = -1
        }
        moveSlide((currentSlide += 1)) // 每3秒自动播放下一张
    }, 3000)
}

//眼睛点击事件
function eyeClick() {
    let password, openEyeImg, closeEyeImg
    if (loginStyle === "one" || loginStyle === "five") {
        password = document.getElementById('onepassword');
        openEyeImg = document.getElementById('oneopenEyeImg');
        closeEyeImg = document.getElementById('onecloseEyeImg');
    } else {
        password = document.getElementById('password')
        openEyeImg = document.getElementById('openEyeImg')
        closeEyeImg = document.getElementById('closeEyeImg')
    }
    closeEyeImg.addEventListener('click', function () {
        password.type = 'text'
        closeEyeImg.style.display = 'none'
        openEyeImg.style.display = 'block'
    })
    openEyeImg.addEventListener('click', function () {
        password.type = 'password'
        closeEyeImg.style.display = 'block'
        openEyeImg.style.display = 'none'
    })
}

//验证码倒计时
function ClickTime() {
    let buttonText
    if (loginStyle === "one" || loginStyle === "five") {
        buttonText = document.getElementById('onebuttonText');
    } else {
        buttonText = document.getElementById('buttonText')
    }
    if (!isDisabled) {
        isDisabled = true
        let count = 59
        buttonText.className = 'buttonTextDisabled'
        buttonText.textContent = `59s`
        const intervalId = setInterval(() => {
            count -= 1
            buttonText.textContent = `${count}s`
            if (count <= 0) {
                clearInterval(intervalId)
                isDisabled = false
                buttonText.textContent = '获取验证码'
                buttonText.className = 'buttonTextblue'
            }
        }, 1000)
    }
}

//获取验证码点击事件
function getCodeClick() {
    //倒计时中则不触发该方法
    if (isDisabled) {
        return
    }

    clearErrors()
    function showError(elementId, message) {
        document.getElementById(elementId).textContent = message
    }
    let phone
    if (loginStyle === "one" || loginStyle === "five") {
        phone = document.getElementById('onephone').value.trim();
    } else {
        phone = document.getElementById('phone').value.trim()
    }

    // 验证手机号是否为空
    if (phone === '') {
        if (loginStyle === "one" || loginStyle === "five") {
            showError('oneBphoneError', '手机号不能为空');
        } else {
            showError('BphoneError', '手机号不能为空')
        }
        return
    }

    const regex = /^1[3-9]\d{9}$/ // 中国大陆手机号正则，以1开头，第二位是3-9，接下来是9位数字
    if (!regex.test(phone && phone.trim())) {
        if (loginStyle === "one" || loginStyle === "five") {
            showError('oneBphoneError', '手机号有误');
        } else {
            showError('BphoneError', '手机号有误')
        }
        return
    }
    // 这里可以执行实际的获取验证码的请求，例如通过 AJAX 发送到服务器且触发倒计时ClickTime()
    simpleAxios({
        url: serverUrl + '/getPhoneCode?businessCode=PHONE_AUTH_LOGIN&phone=' + phone,
        method: 'get'
    })
        .then(function (res) {
            console.log(res.code)
            if (200 == res.code) {
                showMessage('发送成功', 'success')
                //倒计时
                ClickTime()
            } else {
                showMessage(res.msg, 'error')
            }
        })
        .catch(function (err) {
            showMessage(err, 'error')
            console.log(err)
        })
}

//登录方法
function ssoLogin(data) {
    simpleAxios({
        url: serverUrl + '/sso/doLogin',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (res) {
            // res.data=res
            if (200 == res.code) {
                showMessage('登录成功', 'success')
                //登录成功后需处理相关逻辑,如城市热点等

                var location_href = location.href
                if (ispSelEnable == 'YES') {
                    //isp
                    location_href = addParamToUrl(location_href, 'isp', currentSelection)
                }

                location.href = location_href
            } else if (16300 == res.code) {
                var location_href = location.href
                if (ispSelEnable == 'YES') {
                    //isp
                    location_href = addParamToUrl(location_href, 'isp', currentSelection)
                }


                var urlTemp = addParamToUrl(serverUrl + '/userSafe/multipleFactorPage', 'back', encodeURIComponent(location_href))
                urlTemp = addParamToUrl(urlTemp, 'ticket', res.msg)
                location.href = urlTemp
            } else if (15101 == res.code) {
                showMessage(res.msg, 'error')
                setTimeout(() => {
                    //修改密码引导
                    var location_href = location.href
                    if (ispSelEnable == 'YES') {
                        //isp
                        location_href = addParamToUrl(location_href, 'isp', currentSelection)
                    }
                    var urlTemp = addParamToUrl(serverUrl + '/upPassWordGuide', 'back', encodeURIComponent(location_href))
                    location.href = urlTemp
                }, 2000) // 延迟1秒
            } else if (15102 == res.code) {
                // 提示信息
                showError('passwordError', res.msg)
                if (document.getElementById('passwordError')) {
                    checkOverflow(document.getElementById('ApasswordLogin'), document.getElementById('passwordError'), { message: res.msg })
                }
                // 取 ticket
                var ticket = res.data

                var location_href = location.href

                var urlTemp = addParamToUrl(
                    serverUrl + '/passwordRulesNotMatch',
                    'back',
                    encodeURIComponent(location_href)
                )

                urlTemp = addParamToUrl(urlTemp, 'ticket', ticket)

                setTimeout(() => {
                    location.href = urlTemp
                }, 1500);
                return
            } else if (601 == res.code) {
                //弹出信息
                var moreUserLoginVO = res.data
                var identityList = _this.identityList
                identityList.splice(0)
                moreUserLoginVO.userInfos.forEach(function (item) {
                    identityList.push({
                        code: item.userCode,
                        name: item.userName
                    })
                })
                _this.userTicket = moreUserLoginVO.userTicket
                _this.isIdentity = true
            } else if (10029 == res.code) {
                //弹出信息
                alert(res.msg)
                if (forgetPasswordEnable == 'ON') {
                    window.location.href = addParamToUrl(pcUpPasswordUrl, 'name', data.name)
                }
            } else {
                // document.getElementById('onepasswordError').textContent = '请输入正确密码';
                // document.getElementById('passwordError').textContent = '请输入正确密码';
                // showMessage("失败","error");
                //输入错误一次,即加1
                passWordErrorNum = passWordErrorNum + 1
                console.log(passWordErrorNum)
                //当输入错误次数达到5次时,显示验证码
                if (passWordErrorNum >= 3) {
                    console.log('大于3次')
                    passwordVerifyCodeEnable = 'ON'
                    $('#checkImg>img').click()
                }
                const dialogContent = document.getElementById('checkContent')
                console.log(checkContent)
                if (dialogContent.style.display === 'flex') {
                    showMessage(res.msg, 'error')
                } else {
                    if (loginStyle === 'one' || loginStyle === "five") {
                        showError('onepasswordError', res.msg)
                        if (document.getElementById('onepasswordError')) {
                            checkOverflow(document.getElementById('oneApasswordLogin'), document.getElementById('onepasswordError'), { message: res.msg })
                        }
                        showError('oneBpasswordError', res.msg)
                        if (document.getElementById('oneBpasswordError')) {
                            checkOverflow(document.getElementById('oneBpasswordLogin'), document.getElementById('oneBpasswordError'), { message: res.msg })
                        }
                    } else {
                        showError('BpasswordError', res.msg)
                        if (document.getElementById('BpasswordError ')) {
                            checkOverflow(document.getElementById('BpasswordLogin'), document.getElementById('BpasswordError '), { message: res.msg })
                        }

                        showError('passwordError', res.msg)
                        if (document.getElementById('passwordError')) {
                            checkOverflow(document.getElementById('ApasswordLogin'), document.getElementById('passwordError'), { message: res.msg })
                        }
                    }
                }

                // showMessage(res.msg,"error");
                //清除验证码text1
                const codeInputs = [
                    document.getElementById('codeInput1'),
                    document.getElementById('codeInput2'),
                    document.getElementById('codeInput3'),
                    document.getElementById('codeInput4')
                ]
                codeInputs.forEach(input => (input.value = ''))
                codeInputs[0].focus()
            }
        })
        .catch(function (err) {
            const dialogContent = document.getElementById('checkContent')

            if (dialogContent.style.display === 'flex') {
                showMessage(err, 'error')
            } else {
                if (loginStyle === 'one' || loginStyle === "five") {
                    showError('onepasswordError', err)
                } else {
                    showError('passwordError', err)
                }
            }
            console.log(err)
        })

}

//二维码
function creatQrCode(qrcode_box) {
    if (qrcode_box.includes('face') || qrcode_box.includes('Face')) {
        if (faceQrTaskStatus == true) {
            return
        }

        faceQrTaskStatus = true
        faceIsover = false
        faceForCount = 0
        document.getElementById('faceQrcodelose').style.display = 'none'
        document.getElementById('faceOneqrcodelose').style.display = 'none'
    } else {
        if (qrTaskStatus == true) {
            return
        }

        qrTaskStatus = true
        isover = false
        forCount = 0
        document.getElementById('qrcodelose').style.display = 'none'
        document.getElementById('oneqrcodelose').style.display = 'none'
    }

    setTimeout(function () {
        if (qrcode_box.includes('face') || qrcode_box.includes('Face')) {
            var tagValue = getCookie('COOKIE_AUTH_SERVER_CLIENT_TAG')
            console.log(serverUrl + '/qrFaceScanCode/' + tagValue)
            console.log(serverUrl + '/qrFaceConfirmLogin/' + tagValue)
            //  this.$refs.qrcode_box.textContent="";
            document.getElementById(qrcode_box).textContent = ''
            var url = serverUrl + '/onlyAppEnvFace?url=' + serverUrl + '/qrFaceScanCode/' + tagValue
            console.log(url)

            // document.getElementById("loading-box").textContent = "";
            /* var qrcode = new QRCode(document.getElementById(qrcode_box), {
                text: url, // 需要转换为二维码的内容
                width: 200,
                height: 200,
                colorDark: '#000000',
                colorLight: '#ffffff'
            });*/

            // 生成二维码的文本内容
            // 二维码的尺寸
            const qrCodeSize = 152
            // logo的尺寸
            const logoSize = 20
            // 边框的宽度
            const borderWidth = 4
            const logoUrl = sysSquareLogo // logo图片路径
            // 创建二维码
            QRCode.toCanvas(document.getElementById(qrcode_box), url, { width: qrCodeSize }, function (error) {
                if (error) console.error(error)
                console.log('QR Code 生成成功')
                // 获取Canvas元素
                const canvas = document.getElementById(qrcode_box)
                const context = canvas.getContext('2d')
                // 计算logo的中心位置
                const logoX = (qrCodeSize - logoSize) / 2
                const logoY = (qrCodeSize - logoSize) / 2
                // 绘制边框
                context.strokeStyle = '#fff' // 边框颜色
                context.lineWidth = borderWidth // 边框宽度
                context.strokeRect(logoX - borderWidth / 2, logoY - borderWidth / 2, logoSize + borderWidth, logoSize + borderWidth)
                // 添加背景色
                context.fillStyle = '#FFF' // 替换为你想要的背景颜色
                context.fillRect(logoX, logoY, logoSize, logoSize) // 在绘制logo的位置绘制一个填充了背景色的矩形
                // 创建一个logo图像对象
                const logo = new Image()
                logo.src = logoUrl // 替换为你的logo图片路径
                // 当logo加载完成后，将其绘制到二维码的中心位置
                logo.onload = function () {
                    context.drawImage(logo, logoX, logoY, logoSize, logoSize)
                }
            })

            /*while(true){
                var res = this.qrLoginRequest();
            }*/
            faceQrLoginRequest()
        } else {
            var tagValue = getCookie('COOKIE_AUTH_SERVER_CLIENT_TAG')
            console.log(serverUrl + '/qrScanCode/' + tagValue)
            console.log(serverUrl + '/qrConfirmLogin/' + tagValue)
            //  this.$refs.qrcode_box.textContent="";
            document.getElementById(qrcode_box).textContent = ''
            var url = serverUrl + '/onlyAppEnv?url=' + serverUrl + '/qrScanCode/' + tagValue
            console.log(url)

            // document.getElementById("loading-box").textContent = "";
            /*var qrcode = new QRCode(document.getElementById(qrcode_box), {
                text: url, // 需要转换为二维码的内容
                width: 200,
                height: 200,
                colorDark: '#000000',
                colorLight: '#ffffff'
            });*/

            // 生成二维码的文本内容
            // 二维码的尺寸
            const qrCodeSize = 152
            // logo的尺寸
            const logoSize = 20
            // 边框的宽度
            const borderWidth = 4
            const logoUrl = sysSquareLogo // logo图片路径
            // 创建二维码
            QRCode.toCanvas(document.getElementById(qrcode_box), url, { width: qrCodeSize }, function (error) {
                if (error) console.error(error)
                console.log('QR Code 生成成功')
                // 获取Canvas元素
                const canvas = document.getElementById(qrcode_box)
                const context = canvas.getContext('2d')
                // 计算logo的中心位置
                const logoX = (qrCodeSize - logoSize) / 2
                const logoY = (qrCodeSize - logoSize) / 2
                // 绘制边框
                context.strokeStyle = '#fff' // 边框颜色
                context.lineWidth = borderWidth // 边框宽度
                context.strokeRect(logoX - borderWidth / 2, logoY - borderWidth / 2, logoSize + borderWidth, logoSize + borderWidth)
                // 添加背景色
                context.fillStyle = '#FFF' // 替换为你想要的背景颜色
                context.fillRect(logoX, logoY, logoSize, logoSize) // 在绘制logo的位置绘制一个填充了背景色的矩形
                // 创建一个logo图像对象
                const logo = new Image()
                logo.src = logoUrl // 替换为你的logo图片路径
                // 当logo加载完成后，将其绘制到二维码的中心位置
                logo.onload = function () {
                    context.drawImage(logo, logoX, logoY, logoSize, logoSize)
                }
            })

            /*while(true){
                var res = this.qrLoginRequest();
            }*/
            qrLoginRequest()
        }
    }, 0)
}

function qrLoginRequest() {
    console.log('发起次数：' + forCount)
    getQrLogin()
        .then(function (res) {
            console.log(res)
        })
        .catch(function (err) {
            forCount++
            if (forCount >= 10) {
                document.getElementById('oneqrcodelose').style.display = 'flex'
                document.getElementById('qrcodelose').style.display = 'flex'
                $('#qrcodetextID').text(scanPromptInfo)
                $('#oneqrcodetextID').text(scanPromptInfo)
                isover = true
                qrTaskStatus = false
            } else {
                qrLoginRequest()
            }
            console.log(err)
        })
}

function faceQrLoginRequest() {
    console.log('人脸发起次数：' + faceForCount)
    getFaceQrLogin()
        .then(function (res) {
            console.log(res)
        })
        .catch(function (err) {
            faceForCount++
            if (faceForCount >= 10) {
                document.getElementById('faceOneqrcodelose').style.display = 'flex'
                document.getElementById('faceQrcodelose').style.display = 'flex'
                $('#faceqrcodetextID').text('请使用智慧校园app扫码')
                $('#faceoneqrcodetextID').text('请使用智慧校园app扫码')
                faceIsover = true
                faceQrTaskStatus = false
            } else {
                faceQrLoginRequest()
            }
            console.log(err)
        })
}

function getQrLogin() {
    return new Promise(function (resolve, reject) {
        simpleAxios({
            url: serverUrl + '/qrLogin',
            method: 'get'
        })
            .then(function (res) {
                if (200 == res.code) {
                    //判断返回信息
                    if (res.data != null) {
                        if (res.data.processActionEnum == 'SCAN_LOGIN_ALREADY_SCAN') {
                            console.log(res.data.userName + ' 已扫码')
                            //_this.scanUserName = res.data.userName;
                            //alert(res.data.userName);
                            $('#qrcodetextID').text(res.data.userName + ' 已扫码')
                            $('#oneqrcodetextID').text(res.data.userName + ' 已扫码')
                            reject(res)
                        } else if (res.data.processActionEnum == 'SCAN_LOGIN_ALREADY_CONFIRM') {
                            location.reload(true)
                            resolve(res)
                        }
                    }
                    reject(res)
                } else {
                    reject(res)

                    showMessage(res.msg, 'error')
                }
            })
            .catch(function (err) {
                reject(err)
                showMessage(err, 'error')
            })
    })
}

function getFaceQrLogin() {
    return new Promise(function (resolve, reject) {
        simpleAxios({
            url: serverUrl + '/faceLogin',
            method: 'get'
        })
            .then(function (res) {
                if (200 == res.code) {
                    //判断返回信息
                    if (res.data != null) {
                        if (res.data.processActionEnum == 'FACE_SCAN_LOGIN_ALREADY_SCAN') {
                            console.log(res.data.userName + ' 人脸已扫码')
                            //_this.scanUserName = res.data.userName;
                            //alert(res.data.userName);
                            $('#faceqrcodetextID').text(res.data.userName + ' 人脸已扫码')
                            $('#faceoneqrcodetextID').text(res.data.userName + ' 人脸已扫码')
                            reject(res)
                        } else if (res.data.processActionEnum == 'FACE_SCAN_LOGIN_ALREADY_CONFIRM') {
                            location.reload(true)
                            resolve(res)
                        }
                    }
                    reject(res)
                } else {
                    reject(res)

                    showMessage(res.msg, 'error')
                }
            })
            .catch(function (err) {
                reject(err)
                showMessage(err, 'error')
            })
    })
}

//第三方登录pc
function tologin(obj) {
    console.log(obj)
    let type = obj.getAttribute('type')
    if (type === 'wechatMpLogin') {
        let currLoc = window.location.href
        var outUrlPrefix = serverUrl + '/outsideLink/auth/WECHAT_OPEN?back='
        if (isWechatBower == 'true') {
            outUrlPrefix = serverUrl + '/outsideLink/auth/WECHAT_MP?back='
        }

        var url = outUrlPrefix + encodeURIComponent(currLoc)
        window.location.href = url
    } else if (type === 'qqLogin') {
        let currLoc = window.location.href
        var outUrlPrefix = serverUrl + '/outsideLink/auth/QQ?back='
        var url = outUrlPrefix + encodeURIComponent(currLoc)
        window.location.href = url
    }
}

function processAbilityOnOff() {
    if (thirdEnable !== 'ON') {
        $('#thirdLoginTextId,#onethirdLoginTextId').hide()
        $('#wechatMpLoginId,#qqLoginId').hide()
    }

    if (smsEnable !== 'ON') {
        $('#sms').hide()
    }

    if (forgetPasswordEnable !== 'ON') {
        $('#forgetPassword,#activateUser').hide()
    }

    //开启isp
    if (ispSelEnable == 'YES') {
        ispListStr = ispListStr.replace(/(&quot;)/g, '"')
        ispList = JSON.parse(ispListStr)
        //ispSelEnable = 'YES';
        //为页面设置单选
        // 页面加载完成后初始化
        document.addEventListener('DOMContentLoaded', () => {
            // 使用模拟数据
            if (loginStyle === 'one' || loginStyle === 'five') {
                document.querySelector('.one-login-content').style.height='38.375rem'
                document.querySelector('.one-login-content-right').style.height='33.625rem'
                document.querySelector('.one-login-content-left').style.backgroundPosition='0 calc(100% - 2.125rem)'

            } else if (loginStyle === 'two' || loginStyle === 'six') {
                document.querySelector('.two-login-allContent').style.minHeight='40rem'
                document.querySelector('.twoContent').style.height='34.375rem'
                document.querySelector('.three-login-content-right').style.height='30.125rem'
                document.querySelector('.two-login-content-left').style.backgroundPosition='0 calc(100% - 1.625rem)'
            } else if (loginStyle === 'three' || loginStyle === 'seven') {
                document.querySelector('.carousel-container').style.height='34.375rem'
              const itemAll=  document.querySelectorAll('.carousel-item')
                for(let i=0;i<itemAll.length;i++){
                    itemAll[i].style.height='34.375rem'
                }
                const imgALL = document.querySelectorAll('.image-container')
                for (let i = 0; i < itemAll.length; i++) {
                    imgALL[i].style.height = '34.375rem'
                }
                document.querySelector('.carousel').style.height='34.375rem'
                document.querySelector('.two-login-allContent').style.minHeight='40rem'
                document.querySelector('.twoContent').style.height='34.375rem'
                document.querySelector('.three-login-content-right').style.height='30.125rem'
                document.querySelector('.two-login-content-left').style.backgroundPosition='0 calc(100% - 1.625rem)'
            } else if (loginStyle === 'four' || loginStyle === 'eight') {
                document.querySelector('.two-login-allContent').style.minHeight='40rem'
                document.getElementById('twoContent').style.height='34.375rem'
                document.querySelector('.three-login-content-right').style.height='30.125rem'
                document.querySelector('.two-login-content-left').style.backgroundPosition='0 calc(100% - 1.625rem)'
            }
            renderOperators(ispList)
        })
    }
}

function showMessage(text, status = 'success', duration = 3000) {
    console.log(status)
    // 创建消息元素
    const messageDiv = document.createElement('div')
    // 添加图标
    const iconDiv = document.createElement('div')
    iconDiv.className = `iconfont icon-${status}`
    const iconDivchild = document.createElement('img')

    iconDivchild.className = `iconfontImg`
    //判断状态
    if (status === 'success') {
        iconDivchild.src = serverUrlStatic + '/purenative/images/duigou.png'
        messageDiv.className = 'simple-message green'
    } else {
        messageDiv.className = 'simple-message red'
        iconDivchild.src = serverUrlStatic + '/purenative/images/close-wihte.png'
    }
    iconDiv.appendChild(iconDivchild)
    messageDiv.appendChild(iconDiv)

    // 添加文本
    const textDiv = document.createElement('div')
    textDiv.className = 'message-text'
    textDiv.textContent = text
    messageDiv.appendChild(textDiv)
    // 将消息添加到页面中
    document.getElementById('messageContainer').appendChild(messageDiv)
    // 设置定时器在指定时间后隐藏消息
    setTimeout(() => {
        messageDiv.style.opacity = '0' // 开始过渡
        // 隐藏并移除消息元素
        setTimeout(() => {
            messageDiv.remove()
        }, 500) // 500ms 后从 DOM 中移除
    }, duration)
}

//验证码自动输入和点击的事件
function chekNum() {
    console.log('进入验证码监听')
    document.addEventListener('DOMContentLoaded', () => {
        const codeInputs = [
            document.getElementById('codeInput1'),
            document.getElementById('codeInput2'),
            document.getElementById('codeInput3'),
            document.getElementById('codeInput4')
        ]
        for (let i = 0; i < codeInputs.length; i++) {
            codeInputs[i].addEventListener('input', function (event) {
                this.value = this.value.slice(-1).replace(/[^A-Za-z0-9]/g, '')
            })
        }
        // const captchaImage = document.getElementById('captchaImage');
        let confirmDig
        if (loginStyle === 'one' || loginStyle === 'five') {
            confirmDig = document.getElementById('onesubmit');
        } else {
            confirmDig = document.getElementById('submit')
        }

        // 假设验证码是 '1234'
        const verificationCode = '1234'

        // 为每个输入框添加监听器，使其自动跳转到下一个输入框
        codeInputs.forEach((input, i) => {
            input.addEventListener('input', () => {
                if (input.value.length === 1) {
                    if (i < codeInputs.length - 1) {
                        codeInputs[i + 1].focus()
                    } else {
                        const inputValues = codeInputs.map(input => input.value).join('')
                        console.log('验证码输入完成', inputValues)
                        //checkContent.style.display = 'none';
                        // 如果是最后一个输入框，自动提交
                        let username, password
                        if (loginStyle === "one" || loginStyle === "five") {
                            username = document.getElementById('oneusername').value.trim();
                            password = document.getElementById('onepassword').value.trim();
                        } else {
                            username = document.getElementById('username').value.trim()
                            password = document.getElementById('password').value.trim()
                        }

                        let data = {
                            name: username,
                            pwd: getSecretParam(password),
                            verifyCode: inputValues,
                            universityId: universityId,
                            loginType: loginType
                        }
                        ssoLogin(data)
                    }
                }
            })
        })
        // 取消按钮点击事件
        document.getElementById('checkCloseDig').addEventListener('click', () => {
            document.getElementById('checkContent').style.display = 'none'
            codeInputs.forEach(input => (input.value = '')) // 清空输入框
        })

        // 开始自动输入验证码（根据需要可以注释掉）
        // autoInputCode();
    })
}

function clearImageCodeInputAndfocus() {
    //清除验证码
    const codeInputs = [
        document.getElementById('codeInput1'),
        document.getElementById('codeInput2'),
        document.getElementById('codeInput3'),
        document.getElementById('codeInput4')
    ]
    codeInputs.forEach(input => (input.value = ''))
    codeInputs[0].focus()
}

function renderOperators(ispList) {
    //只留已开启的
    ispList = ispList.filter(item => item['status-switch'] == 'YES')
    const operatorsList = ispList

    currentSelection = operatorsList[0].code //  用于保存当前选中值 // 默认选中联通
    //根据风格判断id
    let container = null

    if (loginStyle == 'one') {
        container = document.getElementById('oneoperator-container')
    } else {
        container = document.getElementById('operator-container')
    }
    container.innerHTML = ''

    // 创建选项元素
    operatorsList.forEach(op => {
        const id = `op_${op.code}`
        const isChecked = op.code === currentSelection
        const div = document.createElement('div')
        div.className = 'radio-item'
        div.dataset.value = op.code

        // 使用图片表示状态（你可以替换成自己的图片路径）
        const imgSrc = isChecked
            ? serverUrlStatic + '/purenative/images/select-yes.png' // 选中图
            : serverUrlStatic + '/purenative/images/select-no.png' //未选中图

        div.innerHTML = `
                    <input type="radio"  name="operator" value="${op.code}" ${isChecked ? 'checked' : ''}>
                    <img src="${imgSrc}" alt="${op.name}" data-img-for="${op.code}">
                    <label >${op.name}</label>
                `

        container.appendChild(div)

        // 绑定点击事件：点击整个项即可选中
        div.addEventListener('click', () => {
            // 更新当前选中值
            currentSelection = op.code

            // 手动选中对应的 radio（虽然隐藏了，但保留语义和表单提交能力）
            const radio = div.querySelector('input[type="radio"]')
            radio.checked = true

            // 更新所有图片状态
            updateAllImages()
            console.log('当前选中值:', currentSelection)
        })
    })
    const xian = document.createElement('div')
    xian.className = 'radio-xian'
    container.appendChild(xian)
    // 初始渲染后立即更新一次图片（确保一致）
    function updateAllImages() {
        document.querySelectorAll('.radio-item').forEach(item => {
            const val = item.dataset.value
            const img = item.querySelector('img')
            if (val === currentSelection) {
                img.src = serverUrlStatic + '/purenative/images/select-yes.png'
            } else {
                img.src = serverUrlStatic + '/purenative/images/select-no.png'
            }
        })
    }
}
