import HomeHeader from '../components/HomeHeader';  // 引入新的组件名
import Carousel from '../components/Carousel'
import Intro from '../components/Intro'
import FloatingBackground from '../components/FloatingBackground';

function Home() {
    return (
        <div style={wrapperStyle}>
            <TestFixedBox />
            <HomeHeader />
            <Carousel />
            <Intro />
            {/* 下面是Gallery和Text */}
        </div>
    );
}

const wrapperStyle = {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',  // 左右留白
    boxSizing: 'border-box',
    position: 'relative',
};



export default Home;