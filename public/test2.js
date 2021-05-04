(function () {
  let yOffset = 0; // window.pageYOffset 대신 쓸 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
  let enterNewScene = false; // 새로운 scene이 시작된 순간 true
  let acc = 0.1;
  let delayedYOffset = 0;
  let rafId;
  let rafState;
  const ratioArr1 = [0.43, 0.49, 0.529, 0.587, 0.634, 0.7];
  // const ratioArr2 = [0.73, 0.79, 0.829, 0.887, 0.934, 0.95];

  const sceneInfo = [
    {
      // 0
      type: "sticky",
      heightNum: 6, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0"),
        ribbonPath: document.querySelector(".ribbon1-path path"),
        messageB: document.querySelector(
          "#scroll-section-0 .main-message.first"
        ),
        svg1: document.querySelector(".svgtest"),
        nav: document.querySelector(".local-nav"),
        svg: document.querySelector(".ribbon1-path svg"),
        testimg: document.querySelector(".testimg"),
        eraser: document.querySelector(".testimgwrap:nth-child(2) .testimg"),
        bookwrap: document.querySelector(".bookwrap"),
        book: document.querySelector(".book"),
        movebook: document.querySelector(".book .movebook"),
        svgtext: document.querySelector(".bookwrap svg text"),
      },
      values: {
        messageB_opacity_in: [0, 1, { start: 0.55, end: 0.65 }],
        messageB_opacity_out: [1, 0, { start: 0.75, end: 0.85 }],
        testimg_opacity: [0, 1, { start: 0.3, end: 0.39 }],
        eraser_opacity: [0, 1, { start: 0.6, end: 0.7 }],
        path_dashoffset_in: [0, 0, { start: 0.4, end: 0.7 }],
        path_dashoffset_out: [0, 0, { start: 0.73, end: 0.95 }],
        book_rotate: [61, 0, { start: 0, end: 0.3 }],
        book_translateY: [0, -100, { start: 0.3, end: 0.4 }],
        hi_opacity: [0, 1, { start: 0.15, end: 0.3 }],
        hi_opacity_b: [1, 0, { start: 0.15, end: 0.3 }],
        hi_dashoffset: [25, -25, { start: 0, end: 0.3 }],
        hi_dasharray_50: [50, 0, { start: 0, end: 0.3 }],
        hi_dasharray_100: [0, 50, { start: 0, end: 0.3 }],
        hi_fill_50_a: [255, 16, { start: 0.15, end: 0.3 }],
        hi_fill_50_b: [255, 152, { start: 0.15, end: 0.3 }],
        hi_fill_50_c: [255, 173, { start: 0.15, end: 0.3 }],
      },
    },
    {
      // 1
      type: "sticky",
      heightNum: 12,
      // heightNum: 5, // type normal에서는 필요 없음
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
        content: document.querySelector("#scroll-section-1 .description"),
        messageA: document.querySelector("#scroll-section-1 .main-message.a"),
        messageB: document.querySelector("#scroll-section-1 .main-message.b"),
        messageC: document.querySelector("#scroll-section-1 .main-message.c"),
        messageD: document.querySelector("#scroll-section-1 .main-message.d"),
        canvas: document.querySelector("#video-canvas-1"),
        context: document.querySelector("#video-canvas-1").getContext("2d"),
        ribbonPath: document.querySelector(".ribbon-path path"),
        stickyAll: document.querySelectorAll("#scroll-section-1 .sticky-elem"),
        svg: document.querySelector(".ribbon-path svg"),
        project_blend: document.querySelector(".project-blending"),
        myskill_wrap: document.querySelector(".myskill-wrap"),
        myskill: document.querySelectorAll(".myskill"),
        arrow1: document.querySelector(".arrow1"),
        arrow2: document.querySelector(".arrow2"),
        overprojectwrap: document.querySelector(".overprojectwrap"),
        bookwrap: document.querySelector(".bookwrap"),
        videoImagestest: [],
        videoImages: [],
      },
      values: {
        videoImageCounttest: 280,
        imageSequencetest: [0, 279],
        videoImageCount: 960,
        imageSequence: [0, 959],
        canvas_opacity_in: [0, 1, { start: 0, end: 0.07 }],
        // canvas_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
        ribbon_dashoffset: [0, 0, { start: 0.4, end: 0.6 }],
        blend_scale: [1, 0.7, { start: 0, end: 0 }],
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.15 }],
        messageB_opacity_in: [0, 1, { start: 0.18, end: 0.23 }],
        messageC_opacity_in: [0, 1, { start: 0.26, end: 0.31 }],
        messageD_opacity_in: [0, 1, { start: 0.34, end: 0.39 }],
        messageA_translateY_in: [20, 1, { start: 0.1, end: 0.15 }],
        messageB_translateY_in: [20, 1, { start: 0.18, end: 0.23 }],
        messageC_translateY_in: [20, 1, { start: 0.26, end: 0.31 }],
        messageD_translateY_in: [20, 1, { start: 0.34, end: 0.39 }],
        messageA_opacity_out: [1, 0, { start: 0.15, end: 0.17 }],
        messageB_opacity_out: [1, 0, { start: 0.23, end: 0.25 }],
        messageC_opacity_out: [1, 0, { start: 0.31, end: 0.33 }],
        messageD_opacity_out: [1, 0, { start: 0.39, end: 0.42 }],
        messageA_translateY_out: [0, -20, { start: 0.15, end: 0.17 }],
        messageB_translateY_out: [0, -20, { start: 0.23, end: 0.25 }],
        messageC_translateY_out: [0, -20, { start: 0.31, end: 0.33 }],
        messageD_translateY_out: [0, -20, { start: 0.39, end: 0.42 }],
        skill0: [0, 1, { start: 0.542, end: 0.552 }],
        skill1: [0, 1, { start: 0.501, end: 0.511 }],
        skill2: [0, 1, { start: 0.47, end: 0.48 }],
        skill3: [0, 1, { start: 0.47, end: 0.48 }],
        skill4: [0, 1, { start: 0.537, end: 0.547 }],
        skill5: [0, 1, { start: 0.51, end: 0.52 }],
        skill6: [0, 1, { start: 0.46, end: 0.47 }],
        mobile_skill0: [0, 1, { start: 0.551, end: 0.561 }],
        mobile_skill1: [0, 1, { start: 0.478, end: 0.488 }],
        mobile_skill2: [0, 1, { start: 0.545, end: 0.555 }],
        mobile_skill3: [0, 1, { start: 0.472, end: 0.482 }],
        mobile_skill4: [0, 1, { start: 0.538, end: 0.548 }],
        mobile_skill5: [0, 1, { start: 0.465, end: 0.475 }],
        mobile_skill6: [0, 1, { start: 0.531, end: 0.541 }],
      },
    },
    // {
    //   // 1
    //   type: "sticky",
    //   heightNum: 3,
    //   // heightNum: 5, // type normal에서는 필요 없음
    //   scrollHeight: 0,
    //   objs: {
    //     container: document.querySelector("#scroll-section-2"),
    //   },
    //   values: {},
    // },
  ];
  const desktopArr = [
    sceneInfo[1].values.skill0,
    sceneInfo[1].values.skill1,
    sceneInfo[1].values.skill2,
    sceneInfo[1].values.skill3,
    sceneInfo[1].values.skill4,
    sceneInfo[1].values.skill5,
    sceneInfo[1].values.skill6,
  ];
  const mobileArr = [
    sceneInfo[1].values.mobile_skill0,
    sceneInfo[1].values.mobile_skill1,
    sceneInfo[1].values.mobile_skill2,
    sceneInfo[1].values.mobile_skill3,
    sceneInfo[1].values.mobile_skill4,
    sceneInfo[1].values.mobile_skill5,
    sceneInfo[1].values.mobile_skill6,
  ];

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === "normal") {
        // objs.content가 없는 경우, sceneInfo에 objs.content를 추가해야 합니다.
        // 예를들어 아래의 구조라면, content는 섹션의 내용을 통째로 감싸는 .description으로 지정해주시면 됩니다.
        // 강의에서 진행하는 메인 소스(main.js)에 구현되어 있는 부분을 참고하시면 쉽습니다.
        // <section class="scroll-section">
        //     <div class="description">
        //         lorem ipsum
        //     </div>
        // </section>
        sceneInfo[i].scrollHeight =
          sceneInfo[i].objs.content.offsetHeight + window.innerHeight * 0.5;
      }
      sceneInfo[
        i
        // ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
      ].objs.container.style.height = sceneInfo[i].scrollHeight + "px";
    }
    // sceneInfo[1].objs.container.style.marginTop = `${sceneInfo[0].scrollHeight}px`;
    sceneInfo[1].objs.container.style.marginTop =
      sceneInfo[0].scrollHeight + "px";
    yOffset = window.pageYOffset;

    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }

    document.body.setAttribute("id", `show-scene-${currentScene}`);
    const heightRatio = window.innerHeight / 1080;
    // 여기
    sceneInfo[1].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    sceneInfo[1].objs.project_blend.style.marginTop = `${
      sceneInfo[1].scrollHeight * 0.6 + window.innerHeight
    }px`;

    sceneInfo[1].objs.arrow2.addEventListener("click", () => {
      sceneInfo[1].objs.overprojectwrap.style.transform = "translateX(-50%)";
      sceneInfo[1].objs.arrow2.style.display = "none";
      sceneInfo[1].objs.arrow1.style.display = "block";
    });
    sceneInfo[1].objs.arrow1.addEventListener("click", () => {
      sceneInfo[1].objs.overprojectwrap.style.transform = "translateX(0)";
      sceneInfo[1].objs.arrow2.style.display = "block";
      sceneInfo[1].objs.arrow1.style.display = "none";
    });
    document.querySelector("#moveskill").style.top = `${
      sceneInfo[1].scrollHeight * 0.47
    }px`;

    let myskillpadding;
    if (window.innerWidth >= 320 && window.innerWidth <= 480) {
      let removePin = ["pin0", "pin1"];
      myskillpadding =
        (window.innerWidth * 0.7 - window.innerWidth * 0.17 * 2) / 4;
      sceneInfo[1].objs.myskill[1].children[0].children[0].classList.replace(
        "pin0",
        "pin1"
      );
      sceneInfo[1].objs.myskill[1].children[0].children[1].classList.replace(
        "myskill_desc",
        "myskill_desc1"
      );
      sceneInfo[1].objs.myskill[2].children[0].children[0].classList.replace(
        "pin1",
        "pin0"
      );
      sceneInfo[1].objs.myskill[2].children[0].children[1].classList.replace(
        "myskill_desc1",
        "myskill_desc"
      );
      sceneInfo[1].objs.myskill[5].children[0].children[0].classList.replace(
        "pin0",
        "pin1"
      );
      sceneInfo[1].objs.myskill[5].children[0].children[1].classList.replace(
        "myskill_desc",
        "myskill_desc1"
      );
      sceneInfo[1].objs.myskill[6].children[0].children[0].classList.replace(
        "pin1",
        "pin0"
      );
      sceneInfo[1].objs.myskill[6].children[0].children[1].classList.replace(
        "myskill_desc1",
        "myskill_desc"
      );
      sceneInfo[1].objs.myskill[0].children[0].children[0].style.top = "85%";
      sceneInfo[1].objs.myskill[0].children[0].children[0].style.transform =
        "rotate(-33deg)";
      sceneInfo[1].objs.myskill[0].children[0].children[1].style.top = "60%";
      sceneInfo[1].objs.myskill[1].children[0].children[0].style.top = "85%";
      sceneInfo[1].objs.myskill[1].children[0].children[0].style.transform =
        "rotate(33deg)";
      sceneInfo[1].objs.myskill[1].children[0].children[1].style.top = "60%";
    } else {
      myskillpadding =
        (window.innerWidth * 0.35 - window.innerWidth * 0.1 * 2) / 4;
    }

    document.querySelector(
      ".myskill2"
    ).children[1].childNodes[1].style.marginLeft = `${myskillpadding}px`;
  }

  function setCanvasImages() {
    // let imgElem;
    // for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
    //   imgElem = new Image();
    //   imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
    //   sceneInfo[0].objs.videoImages.push(imgElem);
    // }
    let imgElemtest;
    for (let i = 0; i < sceneInfo[1].values.videoImageCounttest; i++) {
      imgElemtest = new Image();
      imgElemtest.src = `./testimages1/testimg${i + 1001}.jpg`;
      sceneInfo[1].objs.videoImagestest.push(imgElemtest);
    }
    // let imgElem2;
    // for (let i = 0; i < sceneInfo[1].values.videoImageCount; i++) {
    //   imgElem2 = new Image();
    //   imgElem2.src = `./video/002/IMG_${7027 + i}.JPG`;
    //   sceneInfo[1].objs.videoImages.push(imgElem2);
    // }

    // let imgElem3;
    // for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) {
    //   imgElem3 = new Image();
    //   imgElem3.src = sceneInfo[3].objs.imagesPath[i];
    //   sceneInfo[3].objs.images.push(imgElem3);
    // }
  }

  function calcValues(values, currentYOffset) {
    let rv;
    // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기

    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (
        currentYOffset >= partScrollStart &&
        currentYOffset <= partScrollEnd
      ) {
        rv =
          ((currentYOffset - partScrollStart) / partScrollHeight) *
            (values[1] - values[0]) +
          values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }
    return rv;
  }
  function calcvalue2(values, currentYOffset, ratio = 1, minus = 0) {
    let rv;

    const scrollHeight = sceneInfo[currentScene].scrollHeight * ratio;
    const scrollRatio = Math.abs(
      (currentYOffset - sceneInfo[currentScene].scrollHeight * minus) /
        (scrollHeight - sceneInfo[currentScene].scrollHeight * minus)
    );
    rv = scrollRatio * (values[1] - values[0]) + values[0];

    return rv;
  }
  function checkMenu() {
    if (yOffset > 44) {
      document.body.classList.add("local-nav-sticky");
    } else {
      document.body.classList.remove("local-nav-sticky");
    }
  }
  function imgMove(obj, left, top, xPoint, yPoint) {
    obj.style.left = `${left}px`;
    obj.style.top = `${top}px`;
    obj.style.transform = `translate(${xPoint}px,${yPoint}px)`;
  }
  function scrollImgMove(ratioArr, imgobj, version = 0) {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (scrollRatio <= ratioArr[0]) {
      // obj, left, top, xPoint, yPoint

      imgMove(
        imgobj,
        window.innerWidth * 0.3,
        window.innerHeight * 0.3,
        calcvalue2(
          [0, -window.innerWidth * 0.05],
          currentYOffset - scrollHeight * version,
          0.43,
          0.4
        ),
        calcvalue2(
          [0, window.innerHeight * 0.1],
          currentYOffset - scrollHeight * version,
          0.43,
          0.4
        )
      );
    } else {
      if (scrollRatio <= ratioArr[1]) {
        imgMove(
          imgobj,
          window.innerWidth * 0.25,
          window.innerHeight * 0.4,
          calcvalue2(
            [0, window.innerWidth * 0.25],
            currentYOffset - scrollHeight * version,
            0.49,
            0.43
          ),
          calcvalue2(
            [0, -window.innerHeight * 0.1],
            currentYOffset - scrollHeight * version,
            0.49,
            0.43
          )
        );
      } else {
        if (scrollRatio <= ratioArr[2]) {
          imgMove(
            imgobj,
            window.innerWidth * 0.5,
            window.innerHeight * 0.3,
            calcvalue2(
              [0, -window.innerWidth * 0.1],
              currentYOffset - scrollHeight * version,
              0.529,
              0.49
            ),
            calcvalue2(
              [0, window.innerHeight * 0.15],
              currentYOffset - scrollHeight * version,
              0.529,
              0.49
            )
          );
        } else {
          if (scrollRatio <= ratioArr[3]) {
            imgMove(
              imgobj,
              window.innerWidth * 0.4,
              window.innerHeight * 0.45,
              calcvalue2(
                [0, window.innerWidth * 0.2],
                currentYOffset - scrollHeight * version,
                0.587,
                0.529
              ),
              calcvalue2(
                [0, -window.innerHeight * 0.15],
                currentYOffset - scrollHeight * version,
                0.587,
                0.529
              )
            );
          } else {
            if (scrollRatio <= ratioArr[4]) {
              imgMove(
                imgobj,
                window.innerWidth * 0.6,
                window.innerHeight * 0.3,
                calcvalue2(
                  [0, -window.innerWidth * 0.1],
                  currentYOffset - scrollHeight * version,
                  0.634,
                  0.587
                ),
                calcvalue2(
                  [0, window.innerHeight * 0.2],
                  currentYOffset - scrollHeight * version,
                  0.634,
                  0.587
                )
              );
            } else {
              if (scrollRatio <= ratioArr[5]) {
                imgMove(
                  imgobj,
                  window.innerWidth * 0.5,
                  window.innerHeight * 0.5,
                  calcvalue2(
                    [0, window.innerWidth * 0.25],
                    currentYOffset - scrollHeight * version,
                    0.7,
                    0.634
                  ),
                  calcvalue2(
                    [0, -window.innerHeight * 0.08],
                    currentYOffset - scrollHeight * version,
                    0.7,
                    0.634
                  )
                );
              }
            }
          }
        }
      }
    }
  }
  function myskillOpacity(scrollRatio, objs, values, currentYOffset) {
    if (window.innerWidth >= 320 && window.innerWidth <= 480) {
      const mobilearr1 = [1, 3, 5];
      const mobilearr2 = [0, 2, 4, 6];
      // skill0: [0, 1, { start: 0.542, end: 0.552 }],
      //   skill1: [0, 1, { start: 0.501, end: 0.511 }],
      //   skill2: [0, 1, { start: 0.47, end: 0.48 }],
      //   skill3: [0, 1, { start: 0.47, end: 0.48 }],
      //   skill4: [0, 1, { start: 0.537, end: 0.547 }],
      //   skill5: [0, 1, { start: 0.51, end: 0.52 }],
      //   skill6: [0, 1, { start: 0.46, end: 0.47 }],
      if (scrollRatio <= 0.5) {
        mobilearr1.map((v) => {
          objs.myskill[v].style.opacity = calcValues(
            mobileArr[v],
            currentYOffset
          );
        });
      } else if (scrollRatio <= 0.59) {
        mobilearr2.map((v) => {
          objs.myskill[v].style.opacity = calcValues(
            mobileArr[v],
            currentYOffset
          );
        });
      }
    } else {
      const desktopArr1 = [2, 3, 6];
      const desktopArr2 = [0, 1, 4, 5];
      if (scrollRatio <= 0.488) {
        desktopArr1.map((v) => {
          objs.myskill[v].style.opacity = calcValues(
            desktopArr[v],
            currentYOffset
          );
        });
      } else if (scrollRatio <= 0.59) {
        desktopArr2.map((v) => {
          objs.myskill[v].style.opacity = calcValues(
            desktopArr[v],
            currentYOffset
          );
        });
      }
    }
  }
  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;
    console.log(scrollHeight, window.pageYOffset, "@");
    switch (currentScene) {
      case 0:
        objs.nav.children[0].children[1].classList.add("highlight");
        objs.nav.children[0].children[2].classList.remove("highlight");

        if (scrollRatio <= 0.65) {
          // in
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_in,
            currentYOffset
          );

          objs.book.style.transform = `translate(-50%, -50%) rotateX(${calcValues(
            values.book_rotate,
            currentYOffset
          )}deg)`;
          objs.svgtext.style.strokeDashoffset = `${calcValues(
            values.hi_dashoffset,
            currentYOffset
          )}%`;
          // objs.svgtext.style.strokeDasharray = "50% 0%";
          objs.svgtext.style.strokeDasharray = `${calcValues(
            values.hi_dasharray_100,
            currentYOffset
          )}% ${calcValues(values.hi_dasharray_50, currentYOffset)}%`;
          objs.svgtext.style.strokeWidth = 3;
          //   hi_opacity: [0,1,{start:0, end:0.3}],
          // hi_dashoffset: [25,-25,{start:0, end: 0.3],
          // hi_dasharray_50: [50,0,{start:0, end:0.3}],
          // hi_dasharray_100: [0,50,{start:0, end:0.3}]
          // hi_fill_50_a:[255,16,{start:0.15,end:0.3}],
          // hi_fill_50_b:[255,152,{start:0.15,end:0.3}],
          // hi_fill_50_c:[255,173,{start:0.15,end:0.3}],
          if (scrollRatio <= 0.15) {
            objs.svgtext.style.fill = "rgba(255, 255, 255, 0)";
            objs.svgtext.style.stroke = "rgba(16, 152, 173, 0.5)";
            // objs.svgtext.style.strokeWidth = 3
          } else {
            objs.svgtext.style.fill = `rgba(16, 152, 173, ${calcValues(
              values.hi_opacity,
              currentYOffset
            )})`;
            objs.svgtext.style.stroke = `rgba(16, 152, 173, ${calcValues(
              values.hi_opacity_b,
              currentYOffset
            )})`;
          }
        } else {
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_out,
            currentYOffset
          );
        }
        // if (scrollRatio >= 0.6) {
        //   objs.eraser.style.opacity = calcValues(
        //     values.eraser_opacity,
        //     currentYOffset
        //   );
        // }
        if (scrollRatio <= 0.73) {
          objs.movebook.style.transform = `translateY(${calcValues(
            values.book_translateY,
            currentYOffset
          )}%)`;
        }

        if (scrollRatio >= 0.4 && scrollRatio <= 0.72) {
          objs.ribbonPath.style.display = "block";
          objs.ribbonPath.style.strokeDashoffset = calcValues(
            values.path_dashoffset_in,
            currentYOffset
          );
          scrollImgMove(ratioArr1, objs.testimg);
        } else if (scrollRatio < 0.4) {
          objs.ribbonPath.style.display = "none";
          objs.testimg.style.opacity = calcValues(
            values.testimg_opacity,
            currentYOffset
          );
          objs.ribbonPath.style.strokeDashoffset = objs.ribbonPath.getTotalLength();
          imgMove(
            objs.testimg,
            window.innerWidth * 0.3,
            window.innerHeight * 0.3,
            0,
            0
          );
        }
        // sceneInfo[1].objs.context.drawImage(
        //   sceneInfo[1].objs.videoImages[0],
        //   0,
        //   0
        // );
        break;

      case 1:
        // let sequence2 = Math.round(
        //   calcValues(values.imageSequence, currentYOffset)
        // );

        if (!objs.bookwrap.classList.contains("afterscene0")) {
          objs.bookwrap.classList.add("afterscene0");
          sceneInfo[0].objs.ribbonPath.style.strokeDashoffset = 0;
          sceneInfo[0].objs.testimg.style.opacity = 1;
          imgMove(
            sceneInfo[0].objs.testimg,
            window.innerWidth * 0.75,
            window.innerHeight * 0.42,
            0,
            0
          );
        }

        values.blend_scale[2].start =
          (scrollHeight * 0.6 + window.innerHeight) / scrollHeight;
        values.blend_scale[2].end =
          (scrollHeight * 0.6 + window.innerHeight) / scrollHeight + 0.1;

        objs.myskill_wrap.addEventListener("mouseover", (e) => {
          // e.preventDefault();
          if (!e.target.classList.contains("myskill")) return;
          // console.log("3");
          e.target.classList.add("visible");
        });
        objs.myskill_wrap.addEventListener("mouseout", (e) => {
          // e.preventDefault();
          // console.log("2");
          if (!e.target.classList.contains("myskill")) return;
          // console.log("4");
          e.target.classList.remove("visible");
        });

        if (scrollRatio <= 0.45) {
          // objs.context.drawImage(objs.videoImages[sequence2], 0, 0);
          if (!rafState) {
            rafId = requestAnimationFrame(loop);
            rafState = true;
          }
          objs.canvas.style.opacity = calcValues(
            values.canvas_opacity_in,
            currentYOffset
          );
          sceneInfo[0].objs.nav.children[0].children[1].classList.remove(
            "highlight"
          );
          sceneInfo[0].objs.nav.children[0].children[2].classList.add(
            "highlight"
          );
          sceneInfo[0].objs.nav.children[0].children[3].classList.remove(
            "highlight"
          );
        }
        if (scrollRatio >= 0.4) {
          objs.ribbonPath.style.display = "block";
          objs.ribbonPath.style.strokeDashoffset = calcValues(
            values.ribbon_dashoffset,
            currentYOffset
          );
          if (
            scrollRatio > 0.45 &&
            scrollRatio <
              (scrollHeight * 0.6 + window.innerHeight) / scrollHeight + 0.1
          ) {
            sceneInfo[0].objs.nav.children[0].children[2].classList.remove(
              "highlight"
            );
            sceneInfo[0].objs.nav.children[0].children[3].classList.add(
              "highlight"
            );
            sceneInfo[0].objs.nav.children[0].children[4].classList.remove(
              "highlight"
            );
          }
          if (
            scrollRatio >=
            (scrollHeight * 0.6 + window.innerHeight) / scrollHeight + 0.1
          ) {
            sceneInfo[0].objs.nav.children[0].children[3].classList.remove(
              "highlight"
            );
            sceneInfo[0].objs.nav.children[0].children[4].classList.add(
              "highlight"
            );
          }
        } else {
          objs.ribbonPath.style.display = "none";
          objs.ribbonPath.style.strokeDashoffset = values.ribbon_dashoffset[0];
        }

        if (scrollRatio <= 0.15) {
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_in,
            currentYOffset
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_in,
            currentYOffset
          )}%,0)`;
        } else {
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_out,
            currentYOffset
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_out,
            currentYOffset
          )}%,0)`;
        }

        if (scrollRatio <= 0.23) {
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_in,
            currentYOffset
          );
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_in,
            currentYOffset
          )}%,0)`;
        } else {
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_out,
            currentYOffset
          );
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_out,
            currentYOffset
          )}%,0)`;
        }
        if (scrollRatio <= 0.31) {
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_in,
            currentYOffset
          );
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_in,
            currentYOffset
          )}%,0)`;
        } else {
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_out,
            currentYOffset
          );
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_out,
            currentYOffset
          )}%,0)`;
        }
        if (scrollRatio <= 0.39) {
          objs.messageD.style.opacity = calcValues(
            values.messageD_opacity_in,
            currentYOffset
          );
          objs.messageD.style.transform = `translate3d(0, ${calcValues(
            values.messageD_translateY_in,
            currentYOffset
          )}%,0)`;
        } else {
          objs.messageD.style.opacity = calcValues(
            values.messageD_opacity_out,
            currentYOffset
          );
          objs.messageD.style.transform = `translate3d(0, ${calcValues(
            values.messageD_translateY_out,
            currentYOffset
          )}%,0)`;
        }
        if (
          scrollRatio >=
          (scrollHeight * 0.6 + window.innerHeight) / scrollHeight
        ) {
          for (let i = 0; i < objs.stickyAll.length; i++) {
            objs.stickyAll[i].classList.add("blendsticky");
          }
          // objs.stickyAll.forEach((v) => v.classList.add("blendsticky"));
          objs.myskill_wrap.classList.add("blendsticky");
          objs.project_blend.style.marginTop = 0;
          objs.project_blend.style.position = "fixed";
          objs.project_blend.style.top = 0;
          // objs.project_blend.style.marginTop = `${currentYOffset}px`;
          // translate(0,${
          //   currentYOffset -
          //   ((scrollHeight * 0.6 + window.innerHeight) / scrollHeight) *
          //     scrollHeight
          // }px)
          objs.project_blend.style.transform = `scale(${calcValues(
            values.blend_scale,
            currentYOffset
          )})`;
        } else {
          for (let i = 0; i < objs.stickyAll.length; i++) {
            objs.stickyAll[i].classList.remove("blendsticky");
          }
          // objs.stickyAll.forEach((v) => v.classList.remove("blendsticky"));
          objs.myskill_wrap.classList.remove("blendsticky");
          objs.project_blend.style.transform = "scale(1)";
          objs.project_blend.style.marginTop = `${
            sceneInfo[1].scrollHeight * 0.6 + window.innerHeight
          }px`;
          objs.project_blend.style.position = "static";
        }
        // skill0: [0, 1, { start: 0.542, end: 0.552 }],
        // skill1: [0, 1, { start: 0.501, end: 0.511 }],
        // skill2: [0, 1, { start: 0.47, end: 0.48 }],
        // skill3: [0, 1, { start: 0.478, end: 0.488 }],
        // skill4: [0, 1, { start: 0.537, end: 0.547 }],
        // skill5: [0, 1, { start: 0.51, end: 0.52 }],
        // skill6: [0, 1, { start: 0.46, end: 0.47 }],
        myskillOpacity(scrollRatio, objs, values, currentYOffset);
      // if (scrollRatio <= 0.488) {
      //   objs.myskill[6].style.opacity = calcValues(
      //     values.skill6,
      //     currentYOffset
      //   );

      //   objs.myskill[2].style.opacity = calcValues(
      //     values.skill2,
      //     currentYOffset
      //   );
      //   objs.myskill[3].style.opacity = calcValues(
      //     values.skill3,
      //     currentYOffset
      //   );
      // } else {
      //   objs.myskill[6].style.opacity = 1;
      //   objs.myskill[2].style.opacity = 1;
      //   objs.myskill[3].style.opacity = 1;
      // }
      // if (scrollRatio <= 0.56) {
      //   objs.myskill[1].style.opacity = calcValues(
      //     values.skill1,
      //     currentYOffset
      //   );
      //   objs.myskill[5].style.opacity = calcValues(
      //     values.skill5,
      //     currentYOffset
      //   );
      //   objs.myskill[4].style.opacity = calcValues(
      //     values.skill4,
      //     currentYOffset
      //   );
      //   objs.myskill[0].style.opacity = calcValues(
      //     values.skill0,
      //     currentYOffset
      //   );
      // } else {
      //   objs.myskill[1].style.opacity = 1;
      //   objs.myskill[5].style.opacity = 1;
      //   objs.myskill[4].style.opacity = 1;
      //   objs.myskill[0].style.opacity = 1;
      // }
      /*
        skill6: [0, 1, { start: 0.465, end: 0.475 }],
        skill2: [0, 1, { start: 0.478, end: 0.488 }],
        skill3: [0, 1, { start: 0.478, end: 0.488 }],
        skill1: [0, 1, { start: 0.501, end: 0.511 }],
        skill5: [0, 1, { start: 0.51, end: 0.52 }],
        skill4: [0, 1, { start: 0.54, end: 0.55 }],
        skill0: [0, 1, { start: 0.552, end: 0.562 }],
        */
    }
  }

  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0;

    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (
      delayedYOffset <
      prevScrollHeight + sceneInfo[currentScene].scrollHeight
    ) {
      document.body.classList.remove("scroll-effect-end");
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      if (currentScene === sceneInfo.length - 1) {
        document.body.classList.add("scroll-effect-end");
      }
      if (currentScene < sceneInfo.length - 1) {
        currentScene++;
      }
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (yOffset < prevScrollHeight) {
      enterNewScene = true;
      // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
      if (currentScene === 0) return;
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (enterNewScene) return;

    playAnimation();
  }

  function setLibbonLayout() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    function roundFunc(num) {
      return Math.round(num);
    }
    sceneInfo[0].objs.svg.setAttribute(
      "viewBox",
      `0 0 ${window.innerWidth} ${window.innerHeight}`
    );
    sceneInfo[1].objs.svg.setAttribute(
      "viewBox",
      `0 0 ${window.innerWidth} ${window.innerHeight}`
    );
    sceneInfo[0].objs.ribbonPath.setAttribute(
      "d",
      `M${roundFunc(width * 0.3)} ${roundFunc(height * 0.3)} L${roundFunc(
        width * 0.25
      )} ${roundFunc(height * 0.4)} L${roundFunc(width * 0.5)} ${roundFunc(
        height * 0.3
      )} L${roundFunc(width * 0.4)} ${roundFunc(height * 0.45)} L${roundFunc(
        width * 0.6
      )} ${roundFunc(height * 0.3)} L${roundFunc(width * 0.5)} ${roundFunc(
        height * 0.5
      )} L${roundFunc(width * 0.75)} ${roundFunc(height * 0.42)}`
    );

    let totalLength1 = sceneInfo[0].objs.ribbonPath.getTotalLength();
    sceneInfo[0].values.path_dashoffset_in[0] = totalLength1;
    sceneInfo[0].values.path_dashoffset_out[1] = -totalLength1;
    sceneInfo[0].objs.testimg.style.left = `${window.innerWidth * 0.3}px`;
    sceneInfo[0].objs.testimg.style.top = `${window.innerHeight * 0.3}px`;
    // sceneInfo[0].objs.eraser.style.left = `${window.innerWidth * 0.3}px`;
    // sceneInfo[0].objs.eraser.style.top = `${window.innerHeight * 0.3}px`;
    sceneInfo[0].objs.ribbonPath.style.strokeDashoffset = totalLength1;
    sceneInfo[0].objs.ribbonPath.style.strokeDasharray = `${
      (totalLength1, totalLength1)
    }`;

    sceneInfo[1].objs.ribbonPath.setAttribute(
      "d",
      `M${roundFunc(width * 0.95)} ${-height * 0.4} V${roundFunc(
        height * 0.95
      )} H${roundFunc(width * 0.7)} V${roundFunc(height * 0.05)} H${roundFunc(
        width * 0.5
      )} V${roundFunc(height * 0.95)} H${roundFunc(width * 0.3)} V${roundFunc(
        height * 0.05
      )} H${roundFunc(width * 0.05)} V${roundFunc(height)}`
    );

    let totalLength = sceneInfo[1].objs.ribbonPath.getTotalLength();
    sceneInfo[1].values.ribbon_dashoffset[0] = totalLength;
    sceneInfo[1].values.ribbon_dashoffset[1] = 0;

    sceneInfo[1].objs.ribbonPath.style.strokeWidth = width * 0.3;
    sceneInfo[1].objs.ribbonPath.style.strokeDasharray = `${
      (totalLength, totalLength)
    }`;
    sceneInfo[1].objs.ribbonPath.style.strokeDashoffset = totalLength;
  }

  function loop() {
    delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

    if (!enterNewScene) {
      if (currentScene === 1) {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = delayedYOffset - prevScrollHeight;

        let sequence2 = Math.round(
          calcValues(values.imageSequencetest, currentYOffset)
        );
        let test = Math.round((sequence2 * 100) / 45);
        if (objs.videoImagestest[test]) {
          objs.context.drawImage(objs.videoImagestest[test], 0, 0);
        }
        // let sequence2 = Math.round(
        //   calcValues(values.imageSequence, currentYOffset)
        // );
        // let test = Math.round((sequence2 * 100) / 45);

        // if (objs.videoImages[test]) {
        //   objs.context.drawImage(objs.videoImages[test], 0, 0);
        // }
      }
    }
    if (delayedYOffset < 1) {
      scrollLoop();
    }

    rafId = requestAnimationFrame(loop);

    if (Math.abs(window.pageYOffset - delayedYOffset) < 1) {
      cancelAnimationFrame(rafId);
      rafState = false;
    }
  }
  function findBrowser() {
    var agt = navigator.userAgent.toLowerCase();
    if (agt.indexOf("chrome") != -1) return "Chrome";
    if (agt.indexOf("opera") != -1) return "Opera";
    if (agt.indexOf("staroffice") != -1) return "Star Office";
    if (agt.indexOf("webtv") != -1) return "WebTV";
    if (agt.indexOf("beonex") != -1) return "Beonex";
    if (agt.indexOf("chimera") != -1) return "Chimera";
    if (agt.indexOf("netpositive") != -1) return "NetPositive";
    if (agt.indexOf("phoenix") != -1) return "Phoenix";
    if (agt.indexOf("firefox") != -1) return "Firefox";
    if (agt.indexOf("safari") != -1) return "Safari";
    if (agt.indexOf("skipstone") != -1) return "SkipStone";
    if (
      (navigator.appName == "Netscape" &&
        navigator.userAgent.search("Trident") != -1) ||
      agt.indexOf("msie") != -1
    )
      return "Internet Explorer";
    if (agt.indexOf("netscape") != -1) return "Netscape";
    if (agt.indexOf("mozilla/5.0") != -1) return "Mozilla";
  }
  window.addEventListener("load", () => {
    setCanvasImages();
    const browser = findBrowser();
    if (browser === "Internet Explorer") {
      sceneInfo[0].objs.svg1.style.height = "100vh";
      sceneInfo[1].objs.svg.style.height = "100vh";
    }
    document.body.classList.remove("before-load");
    setLayout();

    setLibbonLayout();

    let tempYOffset = yOffset;
    let tempScrollCount = 0;
    if (yOffset > 0) {
      let siId = setInterval(() => {
        window.scrollTo(0, tempYOffset);
        tempYOffset += 5;

        if (tempScrollCount > 20) {
          clearInterval(siId);
        }
        tempScrollCount++;
      }, 20);
    }

    window.addEventListener("scroll", () => {
      yOffset = window.pageYOffset;
      if (yOffset > sceneInfo[0].scrollHeight - 72) {
        sceneInfo[0].objs.nav.classList.add("pin");
      } else {
        sceneInfo[0].objs.nav.classList.remove("pin");
      }
      checkMenu();
      scrollLoop();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        setLayout();
      }

      setLibbonLayout();
    });

    window.addEventListener("orientationchange", () => {
      setTimeout(setLayout, 500);
    });
    if (yOffset === 0) {
      sceneInfo[0].objs.nav.children[0].children[1].classList.add("highlight");
    }
  });
})();
