$(document).ready(function () {
    // 获取当前页面的路径层级
    const pathSegments = window.location.pathname.split('/');
    const isInPagesDir = pathSegments.includes('pages');
    const isInColumnsDir = pathSegments.includes('columns');
    const isInArticlesDir = pathSegments.includes('articles');

    // 根据路径层级决定组件路径
    let componentsPath = 'components/';
    if (isInArticlesDir) {
        // 计算需要返回的层级数
        const articlesIndex = pathSegments.indexOf('articles');
        const levelsToRoot = pathSegments.length - articlesIndex - 1;
        componentsPath = '../'.repeat(levelsToRoot) + 'components/';
    } else if (isInPagesDir && isInColumnsDir) {
        componentsPath = '../../components/';
    } else if (isInPagesDir) {
        componentsPath = '../components/';
    }

    // 加载页眉和页脚
    $("#header-placeholder").load(componentsPath + "header.html", function (response, status, xhr) {
        if (status == "error") {
            console.log("加载页眉时出错：", xhr.status, xhr.statusText);
        } else {
            // 页眉加载完成后，调整导航链接并更新激活状态
            adjustNavLinks();
            updateActiveNavItem();
        }
    });

    $("#footer-placeholder").load(componentsPath + "footer.html", function (response, status, xhr) {
        if (status == "error") {
            console.log("加载页脚时出错：", xhr.statusText);
        }
    });

    let currentSlide = 0;
    const slides = $('.carousel-slide');
    const totalSlides = slides.length;

    function showSlide(index) {
        if (index >= totalSlides) index = 0;
        if (index < 0) index = totalSlides - 1;

        currentSlide = index;
        const offset = -currentSlide * 100;
        $('.carousel-container').css('transform', `translateX(${offset}%)`);
    }

    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);

    $('.carousel-button.prev').click(() => showSlide(currentSlide - 1));
    $('.carousel-button.next').click(() => showSlide(currentSlide + 1));

    // 在文章列表页面保存滚动位置
    if (window.location.pathname.includes('/pages/articles.html')) {
        // 保存滚动位置
        $(window).on('scroll', function () {
            sessionStorage.setItem('scrollPosition', window.scrollY);
        });
    }

    // 如果是从文章页面返回，恢复滚动位置
    if (sessionStorage.getItem('scrollPosition') !== null &&
        window.location.pathname.includes('/pages/articles.html')) {
        window.scrollTo(0, parseInt(sessionStorage.getItem('scrollPosition')));
    }
});

// 调整导航链接
function adjustNavLinks() {
    const pathSegments = window.location.pathname.split('/');
    const isInPagesDir = pathSegments.includes('pages');
    const isInColumnsDir = pathSegments.includes('columns');
    const isInArticlesDir = pathSegments.includes('articles');

    const links = $('.nav-links a, .home-link');

    links.each(function () {
        let href = $(this).attr('href');
        if (isInArticlesDir) {
            // 计算需要返回的层级数
            const articlesIndex = pathSegments.indexOf('articles');
            const levelsToRoot = pathSegments.length - articlesIndex - 1;
            const prefix = '../'.repeat(levelsToRoot);

            if (href === 'index.html') {
                $(this).attr('href', prefix + 'index.html');
            } else if (!href.startsWith(prefix)) {
                $(this).attr('href', prefix + href);
            }
        } else if (isInPagesDir && isInColumnsDir) {
            if (href === 'index.html') {
                $(this).attr('href', '../../index.html');
            } else if (!href.startsWith('../../')) {
                $(this).attr('href', '../../' + href);
            }
        } else if (isInPagesDir) {
            if (href === 'index.html') {
                $(this).attr('href', '../index.html');
            } else if (!href.startsWith('../')) {
                $(this).attr('href', '../' + href);
            }
        }
    });
}

// 更新导航栏激活状态
function updateActiveNavItem() {
    const currentPath = window.location.pathname;

    $('.nav-links a').removeClass('active');

    if (currentPath.includes('cognitive-psychology.html')) {
        $('.nav-links a[href*="column.html"]').addClass('active');
    } else if (currentPath.includes('articles.html')) {
        $('.nav-links a[href*="articles.html"]').addClass('active');
    } else if (currentPath.includes('books.html')) {
        $('.nav-links a[href*="books.html"]').addClass('active');
    } else if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
        $('.nav-links a[href*="index.html"]').addClass('active');
    }
}

// 轮播图功能（如果存在）
if (document.querySelector('#mainCarousel')) {
    const myCarousel = document.querySelector('#mainCarousel');
    const carousel = new bootstrap.Carousel(myCarousel, {
        interval: 5000,
        wrap: true
    });
}

// 返回函数
function goBack() {
    // 如果有上一页历史记录，则返回
    if (document.referrer.includes('/pages/articles.html')) {
        history.back();
    } else {
        // 如果直接访问文章页面，则跳转到文章列表页
        const pathSegments = window.location.pathname.split('/');
        const articlesIndex = pathSegments.indexOf('articles');
        const levelsToRoot = pathSegments.length - articlesIndex - 1;
        const prefix = '../'.repeat(levelsToRoot);
        window.location.href = prefix + 'pages/articles.html';
    }
} 