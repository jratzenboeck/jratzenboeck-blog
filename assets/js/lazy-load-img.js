const images = document.querySelectorAll('.js-lazy-image');
const config = {
    // If the image gets within 50px in the Y axis, start the download.
    rootMargin: '50px 0px',
    threshold: 0.01
};

if (!('IntersectionObserver' in window)) {
    images.forEach(function(image) {
        preLoad(image);
    });
} else {
    var observer = new IntersectionObserver(onIntersection, config);
    images.forEach(function(image) {
        observer.observe(image);
    });
}

function onIntersection(entries) {
    entries.forEach(function(entry) {
        if (entry.intersectionRatio > 0) {
            observer.unobserve(entry.target);
            preLoad(entry.target);
        }
    });
}

function preLoad(image) {
    image.src = image.dataset.src;
    if (image.dataset.srcset) {
        image.srcset = image.dataset.srcset;
    }
    image.onload = function() {
       image.removeAttribute('data-src');
       image.removeAttribute('data-srcset');
    };
}

