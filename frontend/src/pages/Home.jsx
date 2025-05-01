import HomeHeader from '../components/HomeHeader';  // 引入新的组件名
import Carousel from '../components/Carousel'
import Intro from '../components/Intro'
function Home() {
    return (
        <div>
            <HomeHeader />
            <Carousel />
            <Intro />
            {/* 下面是Gallery和Text */}
        </div>
    );
}

export default Home;