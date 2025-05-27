import Header from '../components/Header';  // 引入新的组件名
import Carousel from '../components/Carousel'
import Intro from '../components/Intro'


function Home() {
    return (
        <div style={wrapperStyle}>
            <Header />
            <Carousel />
            <Intro />
            {/* 下面是Gallery和Text */}
        </div>
    );
}

const wrapperStyle = {
    width: '100%',
    maxWidth: '1500px',
    margin: '0 auto',
    padding: '0 20px',  // 左右留白
    boxSizing: 'border-box',
    position: 'relative',
};



export default Home;