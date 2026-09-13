# 나의 레시피 북

먹어보고 좋았던 레시피만 모아두는 개인 레시피 사이트입니다. 빌드 도구 없이 순수 HTML/CSS/JS로 되어 있어서, 폴더 그대로 더블클릭해서 봐도 되고 GitHub Pages 등으로 공개해도 됩니다.

## 새 레시피 추가하는 법

1. `assets/js/recipes-data.js` 파일을 엽니다.
2. `RECIPES` 배열 안에 있는 항목 하나를 통째로 복사해서 붙여넣습니다.
3. 값들을 새 레시피 내용으로 바꿉니다. (각 항목의 뜻은 파일 맨 위 주석 참고)
4. 사진이 있으면 `images` 폴더에 넣고, `image` 값에 `"images/파일명.jpg"` 라고 적습니다.
   - 사진이 없으면 `image: ""` 로 두면 자동으로 기본 아이콘이 표시됩니다.
5. 저장하고 `index.html`을 새로고침하면 바로 목록에 나타납니다.

`id` 값은 다른 레시피와 겹치지 않게 영문/숫자/하이픈으로 적어주세요. (예: `"tomato-pasta"`)

## 로컬에서 확인하기

`index.html`을 브라우저로 더블클릭해서 열면 됩니다. 별도 서버 설치가 필요 없습니다.

## GitHub Pages로 공개하기

1. GitHub에서 새 저장소를 만듭니다 (예: `my-recipes`).
2. 이 폴더 전체를 저장소에 올립니다 (push).
3. 저장소의 **Settings → Pages**에서 Source를 `main` 브랜치, 루트 폴더(`/`)로 설정합니다.
4. 몇 분 후 `https://내아이디.github.io/my-recipes` 주소로 접속하면 사이트가 공개됩니다.
5. 이후 레시피를 추가할 때마다 `recipes-data.js`를 수정하고 다시 push하면 사이트가 자동으로 업데이트됩니다.

## 폴더 구조

```
레시피/
  index.html              # 레시피 목록 페이지
  recipe.html             # 레시피 상세 페이지
  assets/css/style.css    # 디자인
  assets/js/recipes-data.js  # 레시피 내용 (여기만 수정하면 됨)
  assets/js/app.js        # 화면에 그려주는 로직 (평소엔 건드릴 필요 없음)
  images/                 # 레시피 사진
```
