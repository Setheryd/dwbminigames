export const loadDWBCharacter = (): Promise<HTMLImageElement> => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = '/dickwifbutt.svg';
	});
};

let cachedDwbImage: HTMLImageElement | null = null;

export const getDwbImage = async (): Promise<HTMLImageElement> => {
	if (cachedDwbImage && cachedDwbImage.complete) return cachedDwbImage;
	cachedDwbImage = await loadDWBCharacter();
	return cachedDwbImage;
};

export const drawDwbImage = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	rotation: number = 0,
) => {
	if (!cachedDwbImage) return;
	ctx.save();
	ctx.translate(x + width / 2, y + height / 2);
	ctx.rotate(rotation);
	ctx.drawImage(cachedDwbImage, -width / 2, -height / 2, width, height);
	ctx.restore();
};
