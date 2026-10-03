import type { ImgHTMLAttributes } from 'react'

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> {
  src: string
  width?: number
  height?: number
  priority?: boolean
}

function responsiveSource(src: string, width: number) {
  return src.replace(/\.webp$/i, `-${width}.webp`)
}

export function OptimizedImage({
  src,
  alt,
  width = 1448,
  height = 1086,
  priority = false,
  sizes = '100vw',
  decoding,
  ...props
}: OptimizedImageProps) {
  const supportsResponsiveSource = /\.webp$/i.test(src)

  return (
    <img
      {...props}
      src={src}
      srcSet={supportsResponsiveSource
        ? `${responsiveSource(src, 480)} 480w, ${responsiveSource(src, 768)} 768w, ${responsiveSource(src, 960)} 960w, ${src} ${width}w`
        : undefined}
      sizes={supportsResponsiveSource ? sizes : undefined}
      width={width}
      height={height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding={decoding ?? 'async'}
    />
  )
}
