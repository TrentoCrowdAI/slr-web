import React from "react";

/**
 * component svg 
 */
const Robot = function (props) {

    return (
        <svg version="1.1" id="robot" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	    viewBox="0 0 1000 1000">
            <path className="st0-robot" d="M406.3,576.3c-46.8,3.4-95,5.9-144.5,7.2c-69.2,1.9-127.2-52.1-130.5-121.3l-3.2-66.9
                c-3.3-70.2,50.9-129.9,121.2-133.2l139.1-6.6c54.8-2.6,101.3,39.7,103.9,94.6l5.8,122.4C500.7,526.3,460,572.3,406.3,576.3z"/>
            <path className="st1-robot" d="M407.4,528.8l-124.1,5.9c-9.8,0.5-18.1-7.1-18.6-16.9l-0.1-3.1c-0.2-4.1,3-7.6,7.1-7.8l144.7-6.8
                c4.1-0.2,7.6,3,7.8,7.1l0.1,3.1C424.8,520,417.2,528.3,407.4,528.8z"/>
            <path className="st2-robot" d="M263.1,415.9L263.1,415.9c-13.1-0.6-23.5-11.2-24.2-24.5l-1.9-39.8c-0.6-13,8.5-24.4,21.1-26.6h0
                c14.9-2.5,28.7,8.8,29.4,24.2l1.9,39.8C290.2,404.2,278,416.6,263.1,415.9z"/>
            <path className="st2-robot" d="M418.4,408.8L418.4,408.8c-14.2,2.2-27.2-9.1-27.9-24.4l-1.9-40.1c-0.7-15.5,11.5-28.2,26.1-26.9h0
                c12.2,1.1,21.7,11.6,22.4,24.6l1.9,40.1C439.5,395.4,430.7,406.9,418.4,408.8z"/>
            <path className="st0-robot" d="M133.6,610.9c126.4,12.4,246,15.2,357.6,6.4c47.7-3.8,87.3,39.8,84.4,92.5l-32.5,594.5
                c-3.9,23.4-99,39-120.6,38.7l-229.1-3.5c-47.1-0.7-86.2-40-91.4-91.7L48.1,707.4C42.6,652.6,84,606.1,133.6,610.9z"/>
            {/*<polyline className="st3-robot" points="598,721 765,627 765.5,459.7 "/>
            <ellipse className="st4-robot" cx="765.6" cy="404.8" rx="167.2" ry="25.7"/>
            <ellipse className="st5-robot" cx="765.6" cy="411.7" rx="107.2" ry="12.5"/>
            <path className="st6-robot" d="M865,427.3c-69.6,13.7-141.5,13.3-212.7-3"/>*/}
            <ellipse transform="matrix(0.9989 -4.710610e-02 4.710610e-02 0.9989 -19.9378 7.7157)" className="st5-robot" cx="153.7" cy="426.9" rx="13.6" ry="70"/>
            <path className="st7-robot" d="M451.3,736.2c-0.4,30.4-52.1,65.7-114.8,64.8c-62.7-0.9-113.2-36.2-112.8-66.6s51.6-44.3,114.3-43.4
                C400.8,691.9,451.8,705.8,451.3,736.2z"/>
            {/*<g>
                <g>
                    <polyline className="st8-robot" points="841.2,211.2 841.2,359.7 711.1,359.7 711.1,187 817,187 		"/>
                    <line className="st9-robot" x1="730.8" y1="207.8" x2="796.8" y2="207.8"/>
                    <line className="st10-robot" x1="729.9" y1="249.7" x2="821" y2="249.7"/>
                    <line className="st10-robot" x1="729.9" y1="272.2" x2="821" y2="272.2"/>
                    <line className="st10-robot" x1="729.9" y1="294.8" x2="821" y2="294.8"/>
                    <line className="st10-robot" x1="729.9" y1="317.3" x2="821" y2="317.3"/>
                    <polyline className="st2-robot" points="841.2,211.2 817,211.2 817,187 		"/>
                    <line className="st2-robot" x1="841.2" y1="211.2" x2="817" y2="187"/>
                </g>
                <g>
                    <polyline className="st8-robot" points="829.1,223.4 829.1,371.8 699,371.8 699,199.1 804.9,199.1 		"/>
                    <line className="st9-robot" x1="718.7" y1="220" x2="784.7" y2="220"/>
                    <line className="st10-robot" x1="717.8" y1="261.8" x2="808.9" y2="261.8"/>
                    <line className="st10-robot" x1="717.8" y1="284.4" x2="808.9" y2="284.4"/>
                    <line className="st10-robot" x1="717.8" y1="306.9" x2="808.9" y2="306.9"/>
                    <line className="st10-robot" x1="717.8" y1="329.5" x2="808.9" y2="329.5"/>
                    <polyline className="st2-robot" points="829.1,223.4 804.9,223.4 804.9,199.1 		"/>
                    <line className="st2-robot" x1="829.1" y1="223.4" x2="804.9" y2="199.1"/>
                </g>
                <g>
                    <polyline className="st8-robot" points="817,235.5 817,384 686.9,384 686.9,211.2 792.8,211.2 		"/>
                    <line className="st11-robot" x1="706.6" y1="232.1" x2="772.6" y2="232.1"/>
                    <line className="st12-robot" x1="705.7" y1="273.9" x2="796.8" y2="273.9"/>
                    <line className="st12-robot" x1="705.7" y1="296.5" x2="796.8" y2="296.5"/>
                    <line className="st12-robot" x1="705.7" y1="319" x2="796.8" y2="319"/>
                    <line className="st12-robot" x1="705.7" y1="341.6" x2="796.8" y2="341.6"/>
                    <polyline className="st2-robot" points="817,235.5 792.8,235.5 792.8,211.2 		"/>
                    <line className="st2-robot" x1="817" y1="235.5" x2="792.8" y2="211.2"/>
                </g>
            </g>*/}
            <g>
                <path className="st13-robot" d="M255,721c47.2,3.6,94.3,4,141.5,1.2"/>
                <path className="st13-robot" d="M246,732c59,4,118,4,177,0"/>
                <path className="st13-robot" d="M252,743c40.2,2.9,80.4,3.7,120.5,2.4"/>
                <path className="st13-robot" d="M258,754c51,4,102,4,153,0"/>
                <path className="st13-robot" d="M261,765c14.5,1.2,29,2,43.5,2.5"/>
            </g>
        </svg>
    );
};

export default Robot;