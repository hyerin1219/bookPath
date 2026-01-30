export default function SkipMenu() {
    return (
        <div className="relative z-[99]">
            <a href="#main" className="absolute  top-[-100px] left-0  w-full  py-2 bg-black  text-white  justify-center font-bold  shadow-lg focus:top-0 ">
                본문 바로가기
            </a>
        </div>
    );
}
