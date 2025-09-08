document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('warriorCanvas');
    const ctx = canvas.getContext('2d');
    const loadingEl = document.getElementById('loading');

    const hairColorInput = document.getElementById('hairColor');
    const skinColorInput = document.getElementById('skinColor');
    const armorBaseColorInput = document.getElementById('armorBaseColor');
    const armorTrimColorInput = document.getElementById('armorTrimColor');
    const resetButton = document.getElementById('resetButton');

    const defaultColors = {
        hair: '#554236',
        skin: '#C58C85',
        armorBase: '#4A6A8A',
        armorTrim: '#FFD700'
    };

    const layerSources = {
        armorBase: 'warrior_armor_base.png',
        skin: 'warrior_skin.png',
        hair: 'warrior_hair.png',
        armorTrim: 'warrior_armor_trim.png'
    };

    const images = {};
    let imagesLoaded = 0;
    const numImages = Object.keys(layerSources).length;

    function loadImage(name, src) {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            images[name] = img;
            imagesLoaded++;
            if (imagesLoaded === numImages) {
                loadingEl.style.display = 'none';
                drawWarrior();
            }
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
        };
    }

    for (const [name, src] of Object.entries(layerSources)) {
        loadImage(name, src);
    }

    function drawLayer(image, color) {
        if (!image) return;

        // Create a temporary canvas to color the layer
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');

        // Draw the grayscale image
        tempCtx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Apply color
        tempCtx.globalCompositeOperation = 'multiply';
        tempCtx.fillStyle = color;
        tempCtx.fillRect(0, 0, canvas.width, canvas.height);

        // Reset composite operation and then use luminosity to preserve highlights/shadows
        tempCtx.globalCompositeOperation = 'luminosity';
        tempCtx.drawImage(image, 0, 0, canvas.width, canvas.height);
        
        tempCtx.globalCompositeOperation = 'destination-in';
        tempCtx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Draw the colored layer onto the main canvas
        ctx.drawImage(tempCanvas, 0, 0);
    }

    function drawWarrior() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawLayer(images.armorBase, armorBaseColorInput.value);
        drawLayer(images.skin, skinColorInput.value);
        drawLayer(images.hair, hairColorInput.value);
        drawLayer(images.armorTrim, armorTrimColorInput.value);
    }

    hairColorInput.addEventListener('input', drawWarrior);
    skinColorInput.addEventListener('input', drawWarrior);
    armorBaseColorInput.addEventListener('input', drawWarrior);
    armorTrimColorInput.addEventListener('input', drawWarrior);
    
    resetButton.addEventListener('click', () => {
        hairColorInput.value = defaultColors.hair;
        skinColorInput.value = defaultColors.skin;
        armorBaseColorInput.value = defaultColors.armorBase;
        armorTrimColorInput.value = defaultColors.armorTrim;
        drawWarrior();
    });
});

