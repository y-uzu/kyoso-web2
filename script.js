// ボタン要素を取得します
const scrollBtn = document.getElementById('scrollBtn');
const learnMoreBtn = document.getElementById('learnMoreBtn');
const contactSection = document.getElementById('contact');

// 「はじめての生成AI」ボタンが押されたら、生成AIの説明までスクロールします
scrollBtn.addEventListener('click', () => {
  document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
});

// 「もっと知りたい人へ」ボタンが押されたら、ページ下部のメッセージに移動します
learnMoreBtn.addEventListener('click', () => {
  contactSection.scrollIntoView({ behavior: 'smooth' });
});

// AI診断の要素を取得します
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');
const quizProgress = document.getElementById('quizProgress');
const quizQuestion = document.getElementById('quizQuestion');
const quizResult = document.getElementById('quizResult');
const resultText = document.getElementById('resultText');
const restartButton = document.getElementById('restartButton');

// 診断で使う質問を定義します
const quizQuestions = [
  { text: '文章や会話でアイデアをまとめたいですか？', category: 'text' },
  { text: 'イラストや写真のような画像を作ってみたいですか？', category: 'image' },
  { text: '声や動画を使った表現に興味がありますか？', category: 'media' },
  { text: '自分の作ったコンテンツを人に伝えたいですか？', category: 'presentation' }
];

// カテゴリごとのスコアを保存します
const scores = {
  text: 0,
  image: 0,
  media: 0,
  presentation: 0
};

let currentQuestion = 0;

// クイズの状態をリセットします
function resetQuiz() {
  currentQuestion = 0;
  scores.text = 0;
  scores.image = 0;
  scores.media = 0;
  scores.presentation = 0;
  quizResult.classList.add('hidden');
  updateQuiz();
}

// 質問文と進捗を更新します
function updateQuiz() {
  const question = quizQuestions[currentQuestion];
  quizProgress.textContent = `質問 ${currentQuestion + 1} / ${quizQuestions.length}`;
  quizQuestion.textContent = question.text;
}

// ユーザーの回答を処理します
function answerQuiz(isYes) {
  const question = quizQuestions[currentQuestion];
  if (isYes) {
    scores[question.category] += 1;
  }

  currentQuestion += 1;

  if (currentQuestion >= quizQuestions.length) {
    showResult();
  } else {
    updateQuiz();
  }
}

// 診断結果を表示します
function showResult() {
  let title = '';
  let description = '';

  if (scores.image >= 1 && scores.media >= 1) {
    title = 'クリエイティブ型AIがぴったりです';
    description = '画像生成と音声・動画生成の組み合わせがよく合います。MidjourneyやSynthesiaなどで、表現の幅を広げてみましょう。';
  } else if (scores.text >= 1 && scores.presentation >= 1) {
    title = 'アイデア整理型AIがぴったりです';
    description = '文章生成とプレゼン向けのAIが役立ちます。ChatGPTやGoogle Bardを使って文章を整理し、発表を準備しましょう。';
  } else if (scores.image >= 1) {
    title = 'ビジュアル表現型AIがぴったりです';
    description = '画像生成サービスが向いています。MidjourneyやDALL·Eでアイデアを視覚化してみましょう。';
  } else if (scores.media >= 1) {
    title = '映像・音声表現型AIがぴったりです';
    description = '動画・音声生成サービスを試してみましょう。RunwayやSynthesiaで自分のストーリーを伝えてみてください。';
  } else {
    title = 'テキスト中心のAIがぴったりです';
    description = '文章生成サービスから始めるのがおすすめです。ChatGPTやGoogle Bardで会話しながらアイデアを広げてみましょう。';
  }

  resultText.innerHTML = `<strong>${title}</strong><br>${description}`;
  quizResult.classList.remove('hidden');
}

// ボタンが押されたときのイベントを設定します
yesButton.addEventListener('click', () => answerQuiz(true));
noButton.addEventListener('click', () => answerQuiz(false));
restartButton.addEventListener('click', resetQuiz);

// ページ読み込み時にクイズを初期化します
resetQuiz();

// ====== 追加のインタラクション ======
// Reveal-on-scroll: IntersectionObserver を使って要素をフェードイン表示
document.addEventListener('DOMContentLoaded', () => {
  const revealTargets = document.querySelectorAll('.feature-card, .type-card, .quiz-card, .hero-content, .section');

  // 初期状態として 'reveal' クラスを付与
  revealTargets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // セクションなら強調クラスを追加
        if (entry.target.classList.contains('section')) {
          entry.target.classList.add('in-view');
        }
      } else {
        entry.target.classList.remove('visible');
        if (entry.target.classList.contains('section')) {
          entry.target.classList.remove('in-view');
        }
      }
    });
  }, { threshold: 0.18 });

  revealTargets.forEach(el => io.observe(el));

  // Back-to-top ボタン
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 380) backToTop.classList.add('show');
      else backToTop.classList.remove('show');
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // クイズのキーボードショートカット: Y=はい, N=いいえ, R=リスタート
  document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'y') yesButton.click();
    if (key === 'n') noButton.click();
    if (key === 'r') restartButton.click();
  });
});
