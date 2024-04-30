# :video_game: 아케이드 게임 제작

![arcade_main](https://github.com/KOPO-DA5/Retro-game-console/assets/72726948/7da9ff1b-e869-41a0-bc5d-052f716b7777)

아케이드 게임은 클래식 비디오 게임을 브라우저에서 즐길 수 있게 하는 웹 애플리케이션입니다. 이 프로젝트는 순수 HTML, CSS, JavaScript로 구현되어 있으며, 테트리스와 횡스크롤 게임을 재현하여 레트로 감성을 느낄 수 있도록 만들어졌습니다.

---

## :computer: 기능

- **게임 선택**: 다양한 레트로 게임 중 선택 가능
- **게임 플레이**: 키보드를 이용한 게임 컨트롤
- **스코어 보드**: 게임 스코어 표시 및 최고 점수 저장
- **사운드 효과**: 게임 플레이 중 다양한 사운드 효과 제공

---

## :wrench: 설치 방법

1. GitHub에서 프로젝트를 클론하세요.
   ```bash
   git clone https://github.com/KOPO-DA5/Retro-game-console.git
   ```
2. 클론된 폴더로 이동합니다.
   ```bash
   cd Retro-game-console
   ```
3. `index.html` 파일을 웹 브라우저에서 엽니다.

---

## :video_game: 사용 방법

웹 브라우저에서 `index.html` 파일을 열면, 사용 가능한 게임 목록이 표시됩니다. 원하는 게임을 선택하고, 키보드의 방향키 및 지정된 액션 키를 사용하여 게임을 시작하세요.

---

## :memo: 기술 스택

- **HTML**: 웹 페이지 마크업
- **CSS**: 스타일링 및 레이아웃 구성
- **JavaScript**: 게임 로직 및 상호작용 구현

---

## :file_folder: 프로젝트 구조

```
📦Retro-game-console
 ┣ 📂audios # 게임 사운드 폴더
 ┃ ┣ 📂dino
 ┃ ┣ 📂else
 ┃ ┗ 📂tetris
 ┣ 📂css # css 폴더
 ┃ ┣ 📜common.css
 ┃ ┣ 📜dinosaur.css
 ┃ ┗ 📜tetris.css
 ┣ 📂images # 게임 이미지 폴더
 ┃ ┣ 📂dinosaur
 ┃ ┃ ┣ 📂kirby
 ┃ ┃ ┣ 📂mario
 ┃ ┃ ┗ 📂mushroom
 ┃ ┗ 📂main
 ┣ 📂js
 ┃ ┣ 📂dinosaur
 ┃ ┃ ┣ 📜dinosaur.js
 ┃ ┃ ┣ 📜main.js
 ┃ ┃ ┗ 📜skin.js
 ┃ ┗ 📂tetris
 ┃ ┃ ┣ 📜board.js
 ┃ ┃ ┣ 📜constants.js
 ┃ ┃ ┣ 📜main.js
 ┃ ┃ ┣ 📜piece.js
 ┃ ┃ ┗ 📜sound.js
 ┃ ┣ 📜app.js
 ┃ ┣ 📜coin.js
 ┃ ┣ 📜gameControler.js
 ┃ ┣ 📜globalState.js
 ┃ ┗ 📜tetris.js
 ┣ 📜index.html
 ┗ 📜Readme.md
```
---

## :raising_hand: 기여 방법

1. 이 프로젝트를 포크합니다.
2. 새로운 브랜치를 만듭니다 (`git checkout -b feature/your_feature`).
3. 변경 사항을 커밋합니다 (`git commit -am 'Add some feature'`).
4. 브랜치에 푸시합니다 (`git push origin feature/your_feature`).
5. 새로운 풀 리퀘스트를 작성합니다.

---

## :question: 도움말

더 많은 정보가 필요하거나 도움이 필요하시면, 담당자를 통해 문의해 주세요.

---

## 소개
레트로 게임 콘솔 웹은 클래식 비디오 게임을 브라우저에서 즐길 수 있게 하는 웹 애플리케이션입니다. 이 프로젝트는 순수 HTML, CSS, JavaScript로 구현되어 있으며, 간단한 게임을 재현하여 레트로 감성을 느낄 수 있도록 만들어졌습니다. 횡스크롤 게임과 테트리스 게임을 즐길 수 있습니다.

---

## 특징
- **자율성**: 플레이어는 자신의 가고자 하는 방향으로 게임을 진행할 수 있습니다. 게임은 제한 없이 플레이어의 활동에 따라 진행됩니다.
- **힐링**: 게임은 긴장감과 압박감을 느끼기보다는 편안한 분위기를 제공하여 플레이어가 게임을 즐기는 것에 중점을 두었습니다.
- **다양한 활동**: 마을에서는 채집, 농사, 요리 등의 활동을 할 수 있으며, 숲에서는 몬스터와 싸우고 낚시를 즐길 수 있습니다.

---

## 게임 플레이 방식

### 게임 이동 방법

| 이동방향 | 방향키 |
|---------|-------|
| 상(위)  | ⬆️    |
| 좌(왼쪽) | ⬅️    |
| 하(아래) |  ⬇️    |
| 우(오른쪽)| ➡️    |

- **메인 화면**: `insert` 키를 눌러 코인을 삽입합니다.
- **게임 선택 화면**: 키보드의 좌우키⬅️➡️를 사용하여 게임을 선택하고, `Enter` 키로 선택합니다.
- **테트리스 게임**:
  - **첫 화면**: 아무 키나 입력하여 게임을 시작합니다.
  - **게임 실행 화면**: 테트리스 블록이 내려오고, 점수가 자동으로 계산됩니다. 
  - **이미지 참조**
  - **좌측 화면**: 로컬 스토리지에 저장된 점수와 닉네임이 내림차순으로 정렬되어 표시됩니다. 현재 남은 코인의 개수도 표시됩니다.
  - **중간 화면**: 테트리스 게임 화면이 표시됩니다. 게임 일시정지 및 게임 오버 시에도 화면에 표시됩니다.
  - **우측 화면**:
    - **상단**: 점수가 자동으로 계산되며, 레벨 별 깨진 줄 수와 현재 사용자의 레벨이 표시됩니다.
    - **하단**: 다음에 나올 테트리스 블록이 표시되고, 소리를 켜거나 끌 수 있으며, 게임을 재개할 수 있는 버튼이 있습니다.
- **횡스크롤 게임**:
  - **게임 선택 화면**: 키보드의 좌우키⬅️➡️를 사용하여 게임 캐릭터를 선택하고, `Enter` 키로 선택합니다.
  - **게임 실행 화면**: 게임 캐릭터가 점프하고 장애물을 피합니다.
  - **게임 오버 화면**: 게임 종료 후 닉네임을 입력하고, 현재 1등부터 3등까지의 랭킹 화면을 표시합니다.
  - **이미지 참조**
  - **상단**: 현재 남은 코인의 개수와 사용자의 점수가 표시됩니다.
- **게임 도중 일시정지**: `Esc` 키를 누르면 세 가지 메뉴 창이 나옵니다. 게임을 재개하거나 재시작하거나 게임 선택 화면으로 돌아갈 수 있습니다.
- **코인**: 게임 시작할 때마다 코인을 1개씩 사용합니다. 코인을 모두 사용하면 카운트 다운 화면이 표시되고, `insert` 키를 눌러 코인을 사용하여 게임을 재시작할 수 있습니다.

---
### 🕹️ 테트리스 게임

| 첫 화면 | 실행 화면 | 이름 입력 | 랭킹 화면 | 일시정지 화면 |
|:---:|:---:|:---:|:---:|:---:|
|<img src="https://github.com/KOPO-DA5/Retro-game-console/assets/72726948/2569d25e-f310-4b81-959f-7e1dac1b1f23" width="100%" height="100%"> | <img src="https://github.com/KOPO-DA5/Retro-game-console/assets/72726948/c4784ecc-f632-4da4-88d5-0e8f1a51fee1" width="100%" height="100%"> | <img src="https://github.com/KOPO-DA5/Retro-game-console/assets/72726948/d0bbedd9-059d-424f-9e35-46504418aa59" width="100%" height="100%"> | <img src="https://github.com/KOPO-DA5/Retro-game-console/assets/72726948/c7da5709-fa50-4bba-8f84-246776c39ac4" width="100%" height="100%"> | <img src="https://github.com/KOPO-DA5/Retro-game-console/assets/72726948/168bb165-7720-40b9-ae8c-0e5183fbde50" width="100%" height="100%"> |
| 아무 키 입력하고 게임 시작 | 게임 실행 화면 | 게임 오버 후 닉네임 입력받기 | 현재 1등-3등까지 랭킹 화면 | 게임 재개, 게임 재시작, 게임 선택 화면으로 돌아가기 버튼 선택 화면

### 🕹️ 횡스크롤 게임

| 첫 화면 | 실행 화면 | 이름 입력 | 랭킹 화면 | 카운트 다운 화면 |
|:---:|:---:|:---:|:---:|:---:|
|<img src="https://github.com/KOPO-DA5/Retro-game-console/assets/72726948/ff9a662c-df2c-4dd1-95be-8311f9645332" width="100%" height="100%"> | <img src="https://github.com/KOPO-DA5/Retro-game-console/assets/72726948/e0e447f6-2c7e-448e-a317-05e03a98b4d5" width="100%" height="100%"> | <img src="https://github.com/KOPO-DA5/Retro-game-console/assets/72726948/e06b1bfa-5392-43ee-a9b1-08c6ec3a39b7" width="100%" height="100%"> | <img src="https://github.com/KOPO-DA5/Retro-game-console/assets/72726948/1a102aba-aefd-4410-8c69-806fd765eed5" width="100%" height="100%"> | <img src="https://github.com/KOPO-DA5/Retro-game-console/assets/72726948/02e990e9-ff41-4a12-aa7d-adf93b8a1fab" width="100%" height="100%"> |
| 게임 캐릭터 선택 | 게임 실행 화면 | 게임 오버 후 닉네임 입력받기 | 현재 1등-3등까지 랭킹 화면 | 코인 전부 사용 시, insert coin 화면


---
  
## 팀
- 김해린
- 성창민
- 송지원
- 최승환

---

## 프로젝트 정보
- 프로젝트 기간: 2024.04.22 - 2024.04.30
