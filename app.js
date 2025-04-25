const image = document.getElementById('image');
    const filters = {
      blur: 0,
      bright: 1,
      contrast: 1,
      grayscale: 0,
      hue: 0,
      invert: 0,
      opacity: 1,
      saturate: 1,
      sepia: 0,
    };

    function updateFilter(e) {
      filters[e.name] = e.value;
      applyFilters();
    }

    function applyFilters() {
      image.style.filter = `
        blur(${filters.blur}px)
        brightness(${filters.bright})
        contrast(${filters.contrast})
        grayscale(${filters.grayscale})
        hue-rotate(${filters.hue}deg)
        invert(${filters.invert})
        opacity(${filters.opacity})
        saturate(${filters.saturate})
        sepia(${filters.sepia})
      `;
    }

    function uploadImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          image.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }

    function downloadImage(type) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = image.naturalWidth || 1920;
      canvas.height = image.naturalHeight || 1080;
      ctx.filter = image.style.filter;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const link = document.createElement('a');
      link.download = `filtered-image.${type}`;
      link.href = canvas.toDataURL(`image/${type}`);
      link.click();
    }

    function resetFilters() {
      for (let key in filters) {
        filters[key] = key === 'bright' || key === 'contrast' || key === 'saturate' ? 1 : 0;
        document.querySelector(`input[name="${key}"]`).value = filters[key];
      }
      applyFilters();
    }