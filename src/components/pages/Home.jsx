/* eslint-disable react/no-unescaped-entities */
import { AiFillGithub } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CircleRightComp from "../CircleRightComp";
import CircleLeftComp from "../CircleLeftComp";

const Home = () => {
  const token = useSelector((state) => state.auth.token);
  return (
    <section
      id="home"
      className="relative z-10 overflow-hidden pt-[120px] pb-16 md:pt-[150px] md:pb-[120px] xl:pt-[180px] xl:pb-[160px] 2xl:pt-[210px] 2xl:pb-[200px]"
    >
      <div>
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div
              className="wow fadeInUp mx-auto max-w-[800px] text-center flex flex-col items-center"
              data-wow-delay=".2s"
            >
              <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                My Games'e Hoşgeldiniz
              </h1>
              <p className="mb-12 text-base font-medium !leading-relaxed text-body-color dark:text-white dark:opacity-90 sm:text-lg md:text-xl">
                Tüm kullanıcılar oynadıkları oyunlarının verilerini özgürce tutup saklayabildiği istatistik websitedir.
              </p>
              <div className="lg:flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link
                  to={"/users"}
                  className="rounded-md bg-primary py-4 px-8 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80 hover:text-sky-800"
                >
                  Tüm Üyeleri Listele
                </Link>
                {token ? (
                  <Link
                    to={`/user/${JSON.parse(token).uid}`}
                    className="rounded-md bg-black/20 py-4 px-8 text-base font-semibold text-black duration-300 ease-in-out hover:bg-black/30 dark:bg-white/20 dark:text-white dark:hover:bg-white/30"
                  >
                    Profil
                  </Link>
                ) : (
                  <Link
                    to={"/auth"}
                    className="rounded-md bg-black/20 py-4 px-8 text-base font-semibold text-black duration-300 ease-in-out hover:bg-black/30 dark:bg-white/20 dark:text-white dark:hover:bg-white/30"
                  >
                    Giriş Yap
                  </Link>
                )}
              </div>
              <Link
                to={"https://github.com/VectortheGreat/my-games"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-sky-800 mt-10 lg:space-x-2 duration-300"
              >
                <p className="text-sm lg:text-lg">
                  Bu bir açık kaynak React Javascript Projesidir. Kaynak kod için
                  <span className="ml-1">
                    tıklayınız
                    <AiFillGithub className="h-8 w-8 lg:h-16 lg:w-16 inline-block ml-4" />
                  </span>
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 z-[-1] opacity-30 lg:opacity-100">
        <CircleRightComp />
      </div>
      <div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
        <CircleLeftComp />
      </div>
    </section>
  );
};

export default Home;
