import { motion } from 'framer-motion';
import Image from 'next/image';
import { LoadingImg } from '../assets';

const SpinningLoading = () => {
    return ( 
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            >
                <Image src={LoadingImg} width={50} height={50} alt="loading" />
            </motion.div>
    );
}
 
export default SpinningLoading;
