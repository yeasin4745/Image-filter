
 
// class 
  class AdvancedImageEditor {
   constructor() {
    this.image = document.getElementById('mainImage');
    this.imageContainer = document.getElementById('imageContainer');
    this.filters = {
     brightness: 100,
     contrast: 100,
     saturate: 100,
     exposure: 0,
     hue: 0,
     temperature: 0,
     tint: 0,
     vibrance: 0,
     blur: 0,
     grayscale: 0,
     sepia: 0,
     invert: 0,
     opacity: 100
    };
    this.originalImage = null;
    this.history = [{ ...this.filters }];
    this.currentHistoryIndex = 0;
    this.presets = JSON.parse(localStorage.getItem('imageFilterPresets') || '{}');
    this.comparing = false;
    
    // Starting 
    this.init();
   }
   
   init() {
    document.getElementById('imageInput').addEventListener('change', (e) => this.handleImageUpload(e));
    this.updateProgressBar(0);
   }
   
   handleImageUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
     const file = files[0];
     this.showLoading(true);
     
     // Update image info
     this.updateImageInfo(file);
     
     const reader = new FileReader();
     reader.onload = (e) => {
      this.image.src = e.target.result;
      this.originalImage = e.target.result;
      this.resetFilters();
      this.showLoading(false);
      this.updateProgressBar(100);
     };
     reader.readAsDataURL(file);
    }
   }
   
   updateImageInfo(file) {
    const img = new Image();
    img.onload = () => {
     document.getElementById('imageDimensions').textContent = `${img.width} × ${img.height}`;
    };
    img.src = URL.createObjectURL(file);
    
    document.getElementById('imageSize').textContent = this.formatFileSize(file.size);
    document.getElementById('imageFormat').textContent = file.type.split('/')[1].toUpperCase();
   }
   
   formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
   }
   
   showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
   }
   
   updateProgressBar(percentage) {
    document.getElementById('progressFill').style.width = percentage + '%';
   }
   
   updateFilter(element, unit) {
    const value = parseFloat(element.value);
    this.filters[element.name] = value;
    
    // Update display value
    const displayElement = document.getElementById(element.name + 'Value');
    if (displayElement) {
     displayElement.textContent = value + unit;
    }
    
    this.applyFilters();
    this.addToHistory();
   }
   
   applyFilters() {
    const filterString = `
                    brightness(${this.filters.brightness}%)
                    contrast(${this.filters.contrast}%)
                    saturate(${this.filters.saturate}%)
                    hue-rotate(${this.filters.hue}deg)
                    blur(${this.filters.blur}px)
                    grayscale(${this.filters.grayscale}%)
                    sepia(${this.filters.sepia}%)
                    invert(${this.filters.invert}%)
                    opacity(${this.filters.opacity}%)
                `;
    
    this.image.style.filter = filterString.replace(/\s+/g, ' ').trim();
    
    // Apply additional effects
    this.applyTemperatureAndTint();
    this.applyExposure();
    this.applyVibrance();
   }
   
   applyTemperatureAndTint() {
    // Simulate temperature and tint using CSS filters and overlays
    const temp = this.filters.temperature;
    const tint = this.filters.tint;
    
    let overlayColor = '';
    if (temp > 0) {
     overlayColor = `rgba(255, 200, 150, ${temp / 300})`;
    } else if (temp < 0) {
     overlayColor = `rgba(150, 200, 255, ${Math.abs(temp) / 300})`;
    }
    
    // Apply via pseudo-element styling would be more complex
    // This is a simplified approach
   }
   
   applyExposure() {
    const exposure = this.filters.exposure;
    if (exposure !== 0) {
     const brightness = 100 + (exposure * 2);
     this.image.style.filter += ` brightness(${brightness}%)`;
    }
   }
   
   applyVibrance() {
    const vibrance = this.filters.vibrance;
    if (vibrance !== 0) {
     const saturation = 100 + vibrance;
     this.image.style.filter += ` saturate(${saturation}%)`;
    }
   }
   
   applyPreset(presetName) {
    const presets = {
     vintage: { brightness: 110, contrast: 120, saturate: 80, sepia: 30, blur: 0.5 },
     noir: { brightness: 90, contrast: 150, saturate: 0, grayscale: 100 },
     warm: { brightness: 105, contrast: 110, saturate: 120, temperature: 20 },
     cool: { brightness: 95, contrast: 105, saturate: 110, temperature: -20 },
     dramatic: { brightness: 85, contrast: 180, saturate: 130, blur: 0 },
     soft: { brightness: 115, contrast: 85, saturate: 90, blur: 2 }
    };
    
    if (presets[presetName]) {
     Object.assign(this.filters, presets[presetName]);
     this.updateAllControls();
     this.applyFilters();
     this.addToHistory();
    }
    console.log(presets[presetName])
   }
   
   updateAllControls() {
    for (const [key, value] of Object.entries(this.filters)) {
     const control = document.querySelector(`input[name="${key}"]`);
     if (control) {
      control.value = value;
      
      // Update display
      const unit = this.getUnit(key);
      const displayElement = document.getElementById(key + 'Value');
      if (displayElement) {
       displayElement.textContent = value + unit;
      }
     }
    }
   }
   
   getUnit(filterName) {
    const units = {
     brightness: '%',
     contrast: '%',
     saturate: '%',
     hue: '°',
     blur: 'px',
     grayscale: '%',
     sepia: '%',
     invert: '%',
     opacity: '%',
     exposure: '',
     temperature: '',
     tint: '',
     vibrance: ''
    };
    return units[filterName] || '';
   }
   
   resetFilters() {
    this.filters = {
     brightness: 100,
     contrast: 100,
     saturate: 100,
     exposure: 0,
     hue: 0,
     temperature: 0,
     tint: 0,
     vibrance: 0,
     blur: 0,
     grayscale: 0,
     sepia: 0,
     invert: 0,
     opacity: 100
    };
    
    this.updateAllControls();
    this.applyFilters();
    this.history = [{ ...this.filters }];
    this.currentHistoryIndex = 0;
    this.updateHistoryPanel();
   }
   
   addToHistory() {
    if (this.currentHistoryIndex < this.history.length - 1) {
     this.history = this.history.slice(0, this.currentHistoryIndex + 1);
    }
    
    this.history.push({ ...this.filters });
    this.currentHistoryIndex = this.history.length - 1;
    
    if (this.history.length > 20) {
     this.history = this.history.slice(-20);
     this.currentHistoryIndex = 19;
    }
    
    this.updateHistoryPanel();
   }
   
   updateHistoryPanel() {
    const panel = document.getElementById('historyPanel');
    panel.innerHTML = '';
    
    this.history.forEach((state, index) => {
     const item = document.createElement('div');
     item.className = 'history-item';
     if (index === this.currentHistoryIndex) {
      item.style.background = '#e5e7eb';
     }
     
     item.innerHTML = `
                        <span>Step ${index}</span>
                        <small>${index === 0 ? 'Original' : 'Modified'}</small>
                    `;
     
     item.onclick = () => this.loadHistoryState(index);
     panel.appendChild(item);
    });
   }
   
   loadHistoryState(index) {
    if (index >= 0 && index < this.history.length) {
     this.filters = { ...this.history[index] };
     this.currentHistoryIndex = index;
     this.updateAllControls();
     this.applyFilters();
     this.updateHistoryPanel();
    }
   }
   
   toggleComparison() {
    this.comparing = !this.comparing;
    if (this.comparing && this.originalImage) {
     this.image.src = this.originalImage;
     this.image.style.filter = 'none';
    } else {
     this.applyFilters();
    }
   }
   
   savePreset() {
    const name = prompt('Enter preset name:');
    if (name) {
     this.presets[name] = { ...this.filters };
     localStorage.setItem('imageFilterPresets', JSON.stringify(this.presets));
     alert('Preset saved successfully!');
    }
   }
   
   downloadImage(format) {
    if (!this.originalImage) {
     alert('Please upload an image first');
     return;
    }
    
    this.showLoading(true);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = this.image.naturalWidth || 1920;
    canvas.height = this.image.naturalHeight || 1080;
    
    // Apply filters to canvas context
    ctx.filter = this.image.style.filter;
    ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
    
    const link = document.createElement('a');
    link.download = `filtered-image-${Date.now()}.${format}`;
    link.href = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.9 : 1);
    link.click();
    
    this.showLoading(false);
   }
  }
  
  // Initialize the editor
  const editor = new AdvancedImageEditor();
  
  console.log(editor)
  
  
  // Global functions for backward compatibility
  function updateFilter(element, unit) {
   editor.updateFilter(element, unit);
  }
  
  function applyPreset(name) {
   editor.applyPreset(name);
  }
  
  function resetFilters() {
   editor.resetFilters();
  }
  
  function downloadImage(format) {
   editor.downloadImage(format);
  }
  
  function toggleComparison() {
   editor.toggleComparison();
  }
  
  function savePreset() {
   editor.savePreset();
  }
  
  function loadHistoryState(index) {
   editor.loadHistoryState(index);
  }
