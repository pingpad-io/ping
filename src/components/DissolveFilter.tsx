export const DissolveFilter = ({ filterId }: { filterId: string }) => {
  const seed = Math.floor(Math.random() * 10000);

  return (
    <svg className="absolute w-0 h-0">
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="turbulence" baseFrequency="0.08" numOctaves="4" result="noise" seed={seed} />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          >
            <animate attributeName="scale" values="0;25;80;150" dur="1s" fill="freeze" />
          </feDisplacementMap>
          <feGaussianBlur in="displaced" stdDeviation="0">
            <animate attributeName="stdDeviation" values="0;0.5;2;5" dur="1s" fill="freeze" />
          </feGaussianBlur>
        </filter>
      </defs>
    </svg>
  );
};
