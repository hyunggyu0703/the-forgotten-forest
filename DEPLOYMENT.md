# the-forgotten-forest — GitHub Pages 배포

## 현재 준비 상태

- `/workspace`는 유효한 Git 저장소가 아닙니다. 실제 실행 환경에서도 `git rev-parse --show-toplevel`이 실패했습니다. 기존 `.git`을 삭제하거나 덮어쓰지 않았고, 임의로 Git 저장소를 초기화하지 않았습니다.
- GitHub CLI의 계정 확인 요청 `gh api user`가 **HTTP 401 Bad credentials**로 실패했습니다. 저장소 생성, 코드 업로드, push, Pages 설정 변경은 수행하지 않았습니다. 저장소 존재 여부와 쓰기 권한도 검증하지 못했습니다.
- Vite base는 **`/the-forgotten-forest/`**입니다.
- `.github/workflows/deploy.yml`은 `main` 푸시와 수동 실행을 지원합니다. Node 22 → Pages 설정 확인 → `npm ci` → `npm test` → `npm run build` → `dist` 업로드 → Pages 배포 순서입니다.
- `contents: read`, `pages: write`, `id-token: write` 권한과 `github-pages` 환경이 지정되어 있습니다.
- `src/`의 게임 코드 13개는 변경 전과 SHA-256이 같습니다. `forest.save`, `forest.settings`, 저장 형식과 게임 로직을 변경하지 않았습니다.

GitHub 계정 이름(OWNER)은 사용자가 자신의 계정을 사용합니다. 토큰이나 비밀번호를 채팅에 보낼 필요가 없습니다.

## iPhone에서 진행하기 — Safari + GitHub Codespaces

iPhone은 배포 관리에 사용할 수 있지만, 게임 플레이는 현재 PC 키보드·마우스가 필요합니다. Codespaces 사용 가능 여부와 무료 할당량은 계정에 따라 다릅니다. 실제 iPhone에서 이 절차를 직접 검증하지는 않았습니다. 메뉴가 보이지 않으면 Safari의 페이지 메뉴에서 **데스크탑 웹사이트 요청**을 사용하세요.

### 1. 소스 ZIP 다운로드

이 프로젝트와 함께 제공한 **`the-forgotten-forest-source.zip`**을 iPhone의 ‘파일’ 앱에 저장합니다. ZIP에는 프로젝트 파일과 숨김 폴더 `.github/`가 포함됩니다. `.git`, 인증 정보, `node_modules`, `dist`, 스크린샷, 브라우저 저장 데이터는 포함하지 않습니다.

**GitHub의 Add file → Upload files에 ZIP만 올리는 것으로는 배포되지 않습니다. GitHub는 ZIP 내부를 자동으로 풀지 않습니다.** 아래 Codespaces에서 압축을 풀고 소스 파일을 커밋합니다.

### 2. 새 저장소 만들기

1. Safari에서 [github.com/new](https://github.com/new)를 열고 본인 계정으로 로그인합니다.
2. Repository name: **`the-forgotten-forest`**.
3. GitHub Free 기준으로는 **Public**을 선택합니다. Private 저장소의 Pages 제공 여부는 요금제에 따라 다릅니다.
4. **Add a README file**을 켜서 초기 커밋을 만들고 저장소를 생성합니다.
5. 기본 브랜치가 **`main`**인지 확인합니다.

이미 같은 이름의 저장소에 다른 코드가 있다면 새 저장소용 아래 복사 절차를 그대로 적용하지 마세요. 먼저 해당 저장소를 백업하고 기존 파일과 비교해야 합니다. 강제 푸시는 사용하지 않습니다.

### 3. Pages 활성화

저장소 **Settings → Pages → Build and deployment → Source → GitHub Actions**를 선택합니다. 이 작업은 계정의 저장소 관리 권한이 필요합니다.

### 4. Codespace에서 소스 준비

1. 저장소 **Code → Codespaces → Create codespace on main**을 선택합니다.
2. 브라우저 편집기가 열리면 파일 탐색기의 저장소 루트에서 **Upload**로 다운로드한 ZIP을 올립니다. 파일 메뉴가 작으면 데스크탑 웹사이트 보기로 바꿉니다.
3. **Terminal → New Terminal**을 열고 다음을 실행합니다. 터미널은 저장소 루트(일반적으로 `/workspaces/the-forgotten-forest`)여야 합니다.

```sh
pwd
git branch --show-current
git remote -v
unzip -o the-forgotten-forest-source.zip
npm ci
npm test
npm run build
```

ZIP은 최상위 폴더 없이 `src/`, `.github/`, `package.json` 등을 바로 포함합니다. 새 저장소의 초기 README는 프로젝트 README로 바뀌며, ZIP에 `.git`이 없어 Codespaces의 Git 연결은 유지됩니다. Safari가 다운로드 이름에 `(1)` 등을 붙였다면 `unzip`에 실제 파일 이름을 사용하세요.

### 5. 변경 확인 후 업로드

테스트와 빌드가 성공했으면 다음을 실행합니다.

```sh
git status --short
git add .github .gitignore src tests index.html package.json package-lock.json vite.config.js README.md DEPLOYMENT.md
git diff --cached --stat
git commit -m "Prepare The Forgotten Forest for GitHub Pages"
git push origin main
```

`git add`는 업로드할 소스만 명시합니다. ZIP, `node_modules`, `dist`와 개인 파일은 포함하지 않습니다. `package-lock.json`, `.github/workflows/deploy.yml`도 반드시 올라가야 합니다.

Codespaces는 로그인한 GitHub 계정의 권한으로 push합니다. 권한 오류가 나면 본인 계정인지, 저장소 쓰기 권한과 Codespaces 접근 허용 여부를 GitHub에서 확인하세요. 해결되지 않으면 아래 GitHub 웹 편집기 대안으로 진행할 수 있습니다. 오류를 무시하거나 강제 푸시하지 마세요.

### 6. 배포 결과 확인

저장소 **Actions → Deploy to GitHub Pages**에서 `build`, `deploy`가 모두 성공하는지 확인합니다. 완료되면 Settings → Pages에 실제 주소가 표시됩니다.

```text
https://OWNER.github.io/the-forgotten-forest/
```

`OWNER`를 본인의 GitHub 계정 이름으로 바꿉니다. 작업을 마친 Codespace는 중지하여 사용 시간을 줄일 수 있습니다.

## Codespaces를 쓸 수 없을 때

Safari의 GitHub 웹 편집기로도 소스를 올릴 수 있습니다. ZIP을 ‘파일’ 앱에서 풀고 GitHub **Add file → Create new file**에서 경로를 포함한 파일명(예: `src/game/Game.js`, `.github/workflows/deploy.yml`)을 입력한 뒤 원문을 붙여 넣어 커밋합니다. 루트 파일부터 올리고 폴더 구조를 그대로 만드세요. 여러 파일을 처리해야 해 시간이 걸리지만 iPhone에 Git이나 Node를 설치할 필요는 없습니다. 중간 커밋은 빌드가 실패할 수 있으므로 마지막 파일까지 올린 뒤 Actions를 다시 실행합니다.

필요한 파일 목록:

- 루트: `index.html`, `package.json`, `package-lock.json`, `vite.config.js`, `.gitignore`, `README.md`, `DEPLOYMENT.md`
- `src/` 아래 모든 파일 (하위 폴더 포함)
- `tests/` 아래 모든 파일
- `.github/workflows/deploy.yml`

GitHub 웹의 ZIP 업로드나 iPhone 파일 다중 선택만으로 폴더 구조가 보존된다고 가정하지 마세요.

## 기존 저장 데이터

- 배포 설정 변경은 `forest.save`와 `forest.settings`를 삭제하거나 변환하지 않습니다.
- `http://localhost:5173`과 `https://OWNER.github.io`는 서로 다른 출처입니다. 기존 로컬 저장은 원래 브라우저·주소에 남고 새 Pages 주소에는 자동으로 복사되지 않습니다.
- 같은 `OWNER.github.io` 아래의 프로젝트들은 localStorage를 공유합니다. 본 프로젝트의 저장 키는 기존 호환성을 위해 그대로 유지했습니다.
- 배포 후 기존 주소의 데이터를 지우거나 브라우저 사이트 데이터를 초기화할 필요가 없습니다. 새 주소에서 NEW GAME을 누르면 그 주소의 저장 데이터에만 적용됩니다.

## 문제 해결

- **JS/CSS 404:** 저장소 이름이 정확한지, 최신 빌드를 배포했는지, `/the-forgotten-forest/` 주소로 접속했는지 확인합니다.
- **Pages 설정 확인 실패:** Settings → Pages에서 Source를 GitHub Actions로 설정하고 저장소 관리 권한을 확인합니다.
- **워크플로가 안 보임:** `.github/workflows/deploy.yml`이 main에 올라갔는지, Actions가 활성화되었는지 확인합니다.
- **배포 권한 오류:** 조직 정책, Pages 제공 요금제, Actions 권한 및 `github-pages` 환경 승인 규칙을 확인합니다.
- **npm ci 실패:** ZIP의 `package.json`과 `package-lock.json`이 모두 같은 버전으로 업로드되었는지 확인합니다.

로컬 재확인은 `npm test`, `npm run build`, `npm run preview` 순서로 하고 `http://localhost:4173/the-forgotten-forest/`를 엽니다. 로컬 테스트 성공이 GitHub 서버의 실제 배포 성공을 대신하지는 않습니다.

## 배포 준비 후 재검증 결과

- `npm test`: 통과. `node tests/core.test.js`로 개별 테스트 4개 통과도 확인했습니다.
- `npm run build`: 성공. 생성된 HTML의 JS/CSS와 모듈 preload 경로가 모두 `/the-forgotten-forest/assets/`입니다.
- 워크플로 YAML을 파싱해 트리거, 권한, 실행 순서, Pages 설정/업로드/배포 action, `dist` 경로 및 `package-lock.json` 존재를 검사했습니다.
- `node tests/browser.mjs`: 메뉴, 수집, 사진/숫자 퍼즐, 챕터 전환, 두 엔딩, 저장 복원, 적 접촉 게임 오버 및 재시작 확인. 페이지 JavaScript 오류 0건.
- `node tests/mechanics.mjs`: 15개 상호작용 지점 접근, 적 상태, 웅크리기 감지 감소와 이동 속도 비교 통과.
- preview 서버에서 `node tests/pages.mjs`: 프로덕션 하위 경로 리소스 로딩, 메뉴, 개발 핸들 제외, 기존 형식 저장/설정 값 유지, CONTINUE로 챕터 4 복원 확인. 리소스 오류와 JavaScript 오류 0건.
- `src/` 13개 파일의 변경 전/후 SHA-256 일치. 브라우저 테스트는 새로 만든 격리된 컨텍스트를 사용해 기존 사용자 브라우저 저장소를 건드리지 않았습니다.

GitHub Actions 자체 실행과 실제 Pages 게시, iPhone 조작은 아직 검증하지 않았습니다.
