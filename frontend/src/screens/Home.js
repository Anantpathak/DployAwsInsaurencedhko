import '../App.css';
import Navbar from '../components/navBar';
import HomeContent from '../components/homeContent'; // Updated component name to match export
import Footer from '../components/footer';
function Home() {
  return (
    <>
      <div className="bg-white">
        {/* Navbar */}
        <header className="sticky-top shadow-sm">
          <Navbar />
        </header>

        <HomeContent />

        {/* Footer Placeholder */}
<Footer/>
      </div>
    </>
  );
}

export default Home;
