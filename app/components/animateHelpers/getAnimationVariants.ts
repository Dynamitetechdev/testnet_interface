 const getAnimationVariants = (delay: Number) => {
    const variants: any = {
      in: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.4, ease: "easeInOut", delay: delay },
      },
      out: {
        y: 20, // adjust as needed
        opacity: 0,
      },
    };
    return variants;
  };

  export {
    getAnimationVariants
  }