export function debounce(func: () => void, wait: number) {
	let timeout : any;
	return function() {
		const later = () => {
			timeout = null;
			func();
		};
		var callNow = !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func();
	};
};