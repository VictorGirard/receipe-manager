interface ImageData {
  url: string;
  thumbnails: {
    small: { url: string };
    large: { url: string };
    full: { url: string };
  };
}

export const getImageUrl = (imageData: ImageData[] | undefined, size: 'small' | 'large' | 'full' = 'large', imageURL?: string): string => {
  console.log(imageURL);
  if (imageURL) {
    return imageURL;
  }
  
  if (!imageData || imageData.length === 0) {
    return '/placeholder-image.jpg'; // Image par défaut
  }

  const image = imageData[0];
  return size === 'full' 
    ? image.url 
    : image.thumbnails[size].url;
};

export const getImageStyle = (size: 'carousel' | 'card' | 'modal' = 'card') => {
  const styles = {
    carousel: {
      container: 'h-[500px] w-full',
      image: 'h-full w-full object-cover',
      overlay: 'absolute inset-0 bg-black/60'
    },
    card: {
      container: 'h-48 w-full',
      image: 'h-full w-full object-cover',
      overlay: 'absolute inset-0 bg-black/40'
    },
    modal: {
      container: 'h-64 w-full',
      image: 'h-full w-full object-cover',
      overlay: 'absolute inset-0 bg-black/30'
    }
  };

  return styles[size];
}; 