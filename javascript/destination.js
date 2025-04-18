const mainDeck = {
    slides: Array.from(document.querySelectorAll('.slide')),
    activeIndex: 0,

    init() {
        this.slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.add('next');
            }
        });
        this.updateControls();
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.next();
            if (e.key === 'ArrowLeft') this.prev();
        });

        document.querySelectorAll('header nav a').forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.slide(index);
            });
        });

        this.initSearch();
        this.initFilters();

        // Add global click handler to reset view
        document.addEventListener('click', (e) => {
            const searchInput = document.getElementById('searchInput');
            const searchResults = document.getElementById('searchResults');
            const filterOptions = document.querySelectorAll('.filter-options');
            const isFilterOption = Array.from(filterOptions).some(opt => opt.contains(e.target));
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target) && !isFilterOption) {
                this.clearSearchSuggestions(this.activeIndex);
                this.clearFilters(this.activeIndex);
            }
        });
    },

    updateControls() {
        const prevBtn = document.querySelector('.controls button:first-child');
        const nextBtn = document.querySelector('.controls button:last-child');
        prevBtn.disabled = this.activeIndex === 0;
        nextBtn.disabled = this.activeIndex === this.slides.length - 1;
    },

    next() {
        if (this.activeIndex < this.slides.length - 1) {
            this.slides[this.activeIndex].classList.remove('active');
            this.slides[this.activeIndex].classList.add('prev');
            this.activeIndex++;
            this.slides[this.activeIndex].classList.remove('next');
            this.slides[this.activeIndex].classList.add('active');
            this.updateControls();
            this.clearFilters(this.activeIndex);
            this.clearSearchSuggestions(this.activeIndex);
        }
    },

    prev() {
        if (this.activeIndex > 0) {
            this.slides[this.activeIndex].classList.remove('active');
            this.slides[this.activeIndex].classList.add('next');
            this.activeIndex--;
            this.slides[this.activeIndex].classList.remove('prev');
            this.slides[this.activeIndex].classList.add('active');
            this.updateControls();
            this.clearFilters(this.activeIndex);
            this.clearSearchSuggestions(this.activeIndex);
        }
    },

    slide(index) {
        if (index >= 0 && index < this.slides.length && index !== this.activeIndex) {
            this.slides[this.activeIndex].classList.remove('active');
            this.slides[this.activeIndex].classList.add(index < this.activeIndex ? 'next' : 'prev');
            this.activeIndex = index;
            this.slides[this.activeIndex].classList.remove('prev', 'next');
            this.slides[this.activeIndex].classList.add('active');
            this.updateControls();
            this.clearFilters(this.activeIndex);
            this.clearSearchSuggestions(this.activeIndex);
        }
    },

    initSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        const allDestinations = Array.from(document.querySelectorAll('.destination-slide')).map((item, idx) => ({
            name: item.querySelector('h3').textContent,
            regionIndex: Array.from(document.querySelectorAll('.slide')).indexOf(item.closest('.slide')),
            itemIndex: idx
        }));

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            searchResults.innerHTML = '';
            if (query) {
                const matches = allDestinations.filter(dest => dest.name.toLowerCase().includes(query));
                matches.forEach(match => {
                    const resultItem = document.createElement('div');
                    resultItem.textContent = match.name;
                    resultItem.addEventListener('click', () => {
                        this.slide(match.regionIndex);
                        this.showSearchSuggestions(match.regionIndex, match.name);
                        searchResults.style.display = 'none';
                        searchInput.value = '';
                    });
                    searchResults.appendChild(resultItem);
                });
                searchResults.style.display = matches.length ? 'flex' : 'none';
            } else {
                searchResults.style.display = 'none';
                this.clearSearchSuggestions(this.activeIndex);
            }
        });
    },

    showSearchSuggestions(regionIndex, selectedAttraction) {
        const slide = this.slides[regionIndex];
        const searchSuggestions = slide.querySelector('.search-suggestions');
        const destinationContainer = slide.querySelector('.destination-container');
        const filterResults = slide.querySelector('.filter-results');
        const filterOptions = slide.querySelector('.filter-options');
        const selectedTypes = Array.from(filterOptions.querySelectorAll('input:checked')).map(cb => cb.value);
        const destinations = Array.from(slide.querySelectorAll('.destination-slide'));

        destinationContainer.classList.add('hidden');
        filterResults.style.display = 'none';
        searchSuggestions.innerHTML = '';

        const matchedDestinations = destinations.filter(dest => {
            const destName = dest.querySelector('h3').textContent.toLowerCase();
            const destTypes = dest.dataset.types ? dest.dataset.types.split(',') : [];
            const matchesName = destName === selectedAttraction.toLowerCase();

            if (selectedTypes.length > 0) {
                const matchedTypes = selectedTypes.filter(type => destTypes.includes(type));
                if (matchedTypes.length === 0) return false;
            }

            return matchesName;
        });

        if (matchedDestinations.length === 0) {
            searchSuggestions.innerHTML = '<p>No found</p>';
            searchSuggestions.style.display = 'flex';
            return;
        }

        matchedDestinations.forEach(dest => {
            const clone = dest.cloneNode(true);
            searchSuggestions.appendChild(clone);
        });

        searchSuggestions.style.display = 'flex';
    },

    clearSearchSuggestions(slideIndex) {
        const slide = this.slides[slideIndex];
        const searchSuggestions = slide.querySelector('.search-suggestions');
        const destinationContainer = slide.querySelector('.destination-container');
        const filterResults = slide.querySelector('.filter-results');
        searchSuggestions.innerHTML = '';
        searchSuggestions.style.display = 'none';
        if (filterResults.style.display !== 'flex') {
            destinationContainer.classList.remove('hidden');
        }
    },

    initFilters() {
        this.slides.forEach(slide => {
            const filterOptions = slide.querySelector('.filter-options');
            const filterResults = slide.querySelector('.filter-results');
            const destinations = Array.from(slide.querySelectorAll('.destination-slide'));

            filterOptions.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    const selectedTypes = Array.from(filterOptions.querySelectorAll('input:checked')).map(cb => cb.value);
                    this.filterDestinations(slide, selectedTypes, destinations, filterResults);
                });
            });
        });
    },

    filterDestinations(slide, selectedTypes, destinations, filterResults) {
        filterResults.innerHTML = '';
        const searchSuggestions = slide.querySelector('.search-suggestions');
        const destinationContainer = slide.querySelector('.destination-container');

        if (selectedTypes.length === 0) {
            filterResults.style.display = 'none';
            if (searchSuggestions.style.display !== 'flex') {
                destinationContainer.classList.remove('hidden');
            }
            return;
        }

        const allTypes = ['Relaxation', 'Adventure', 'Ecotourism', 'Culinary', 'NatureExploration', 'Spiritual', 'Entertainment'];
        if (selectedTypes.length === allTypes.length) {
            filterResults.innerHTML = '<p>No found</p>';
            filterResults.style.display = 'flex';
            destinationContainer.classList.add('hidden');
            searchSuggestions.style.display = 'none';
            return;
        }

        const matches = [];

        destinations.forEach(dest => {
            const destTypes = dest.dataset.types ? dest.dataset.types.split(',') : [];
            const matchedTypes = selectedTypes.filter(type => destTypes.includes(type));
            const score = matchedTypes.length;

            if (selectedTypes.length <= 3) {
                if (score > 0) {
                    matches.push({ dest, score });
                }
    } else {
                if (destTypes.length < 3 && score > 0) {
                    matches.push({ dest, score });
                }
            }
        });

        matches.sort((a, b) => b.score - a.score);

        if (matches.length === 0) {
            filterResults.innerHTML = '<p>No found</p>';
            filterResults.style.display = 'flex';
            destinationContainer.classList.add('hidden');
            searchSuggestions.style.display = 'none';
            return;
        }

        matches.forEach(item => {
            const clone = item.dest.cloneNode(true);
            filterResults.appendChild(clone);
        });

        filterResults.style.display = 'flex';
        destinationContainer.classList.add('hidden');
        searchSuggestions.style.display = 'none';
    },

    clearFilters(slideIndex) {
        const slide = this.slides[slideIndex];
        const filterOptions = slide.querySelector('.filter-options');
        const filterResults = slide.querySelector('.filter-results');
        const destinationContainer = slide.querySelector('.destination-container');
        const searchSuggestions = slide.querySelector('.search-suggestions');
        filterOptions.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        filterResults.innerHTML = '';
        filterResults.style.display = 'none';
        if (searchSuggestions.style.display !== 'flex') {
            destinationContainer.classList.remove('hidden');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    mainDeck.init();
});
