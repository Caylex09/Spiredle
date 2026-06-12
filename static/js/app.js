/**
 * Spiredle — Slay the Spire 2 Card Wordle
 */

(function () {
    "use strict";

    // ---- Localization data (fetched from backend) ------------------------
    let locData = { rarity: {}, type: {}, color: {}, keywords: {} };

    function tRarity(key) { return (locData.rarity && locData.rarity[key.toUpperCase()]) || key; }
    function tType(key) { return (locData.type && locData.type[key.toUpperCase()]) || key; }

    function tColor(key) { return (locData.color && locData.color[key]) || key; }

    // ---- UI Strings (custom app strings, not in game localization) -------
    const UI = {
        eng: {
            title: "Spiredle",
            subtitle: "Slay the Spire 2 · Card Wordle",
            select: "Select Card",
            pickerTitle: "Select a Card",
            pickerPlaceholder: "Search card name or ID...",
            cols: ["Name", "Rarity", "Type", "Cost", "Color", "Keywords"],
            won: "Correct!",
            lost: "Better luck tomorrow!",
            lostRandom: "Keep trying!",
            copy: "Copy Results",
            viewAnswer: "View Card",
            clickToReveal: "Click to reveal",
            refTitle: "Translation Reference",
            refRarity: "Rarity",
            refType: "Type",
            refColor: "Color",
            refKeywords: "Keywords",
            refCost: "Cost",
            themeTitle: "Theme",
            themeDark: "Dark",
            themeLight: "Light",
            themeSystem: "System",
            helpTitle: "How to Play",
            helpIntro: 'Guess the <strong>Slay the Spire 2</strong> card in <strong>6 tries</strong>.',
            helpEachGuess: "Each guess must be a valid card.",
            helpGreen: "Green = correct attribute.",
            helpYellow: "Yellow = partially correct (e.g. same cost but different star cost).",
            helpGray: "Gray = not correct.",
            helpAttribs: '<strong>Attributes:</strong> Name, Rarity, Type, Cost, Color, Keywords',
            helpDaily: 'Updates daily at <strong>00:00 UTC</strong>.',
            cost0: "0-cost",
            cost1: "1-cost",
            cost2: "2-cost",
            cost3: "3-cost",
            costX: "X-cost (variable)",
            costStar: "Base + Star cost",
            costStarVar: "Base + Variable star",
            costUnplay: "Unplayable (Status / Curse)",
            modeDaily: "Daily",
            modeRandom: "Random",
            modePast: "Past Challenges",
            newGame: "New Game",
            continueChallenge: "Continue",
            retryChallenge: "Retry",
            historyTitle: "Past Challenges",
            streakLabel: "Streak",
            bestStreak: "Best Streak",
            timeSpent: "Time",
        },
        zhs: {
            title: "Spiredle",
            subtitle: "杀戮尖塔 2 · 猜卡游戏",
            select: "选择卡牌",
            pickerTitle: "选择卡牌",
            pickerPlaceholder: "搜索卡牌名称或 ID...",
            cols: ["名称", "稀有度", "类型", "费用", "颜色", "关键词"],
            won: "猜对了！",
            lost: "明天再试试！",
            lostRandom: "再接再厉！",
            copy: "复制结果",
            viewAnswer: "查看答案",
            clickToReveal: "点击查看答案",
            refTitle: "翻译参考",
            refRarity: "稀有度",
            refType: "类型",
            refColor: "颜色",
            refKeywords: "关键词",
            refCost: "费用",
            themeTitle: "主题",
            themeDark: "暗色",
            themeLight: "浅色",
            themeSystem: "跟随系统",
            helpTitle: "玩法说明",
            helpIntro: '在 <strong>6 次</strong>内猜出 <strong>杀戮尖塔 2</strong> 的卡牌。',
            helpEachGuess: "每次猜测必须是有效的卡牌。",
            helpGreen: "绿色 = 属性正确。",
            helpYellow: "黄色 = 部分正确（如费用相同但辉星不同）。",
            helpGray: "灰色 = 不正确。",
            helpAttribs: '<strong>属性：</strong>名称、稀有度、类型、费用、颜色、关键词',
            helpDaily: '每天 <strong>00:00 UTC</strong> 更新。',
            cost0: "0 费",
            cost1: "1 费",
            cost2: "2 费",
            cost3: "3 费",
            costX: "X 费（可变）",
            costStar: "基础 + 辉星费用",
            costStarVar: "基础 + 可变辉星",
            costUnplay: "无法打出（状态/诅咒）",
            modeDaily: "每日挑战",
            modeRandom: "随机连胜",
            modePast: "回顾往期",
            newGame: "新的一局",
            continueChallenge: "继续挑战",
            retryChallenge: "重新挑战",
            historyTitle: "回顾往期",
            streakLabel: "连胜",
            bestStreak: "最佳连胜",
            timeSpent: "用时",
        },
        dsu: {
            title: "Spiredle",
            subtitle: "Slay the Spire 2 · Karte Wordle",
            select: "Karte wählen",
            pickerTitle: "Karte auswählen",
            pickerPlaceholder: "Kartenname oder ID suchen...",
            cols: ["Name", "Seltenheit", "Typ", "Kosten", "Farbe", "Schlüsselw."],
            won: "Richtig!",
            lost: "Morgen besser!",
            lostRandom: "Weitermachen!",
            copy: "Ergebnisse kopieren",
            viewAnswer: "Karte anzeigen",
            clickToReveal: "Klicken zum Anzeigen",
            refTitle: "Übersetzungsreferenz",
            refRarity: "Seltenheit",
            refType: "Typ",
            refColor: "Farbe",
            refKeywords: "Schlüsselw.",
            refCost: "Kosten",
            themeTitle: "Thema",
            themeDark: "Dunkel",
            themeLight: "Hell",
            themeSystem: "System",
            helpTitle: "Spielanleitung",
            helpIntro: 'Errate die <strong>Slay the Spire 2</strong>-Karte in <strong>6 Versuchen</strong>.',
            helpEachGuess: "Jeder Versuch muss eine gültige Karte sein.",
            helpGreen: "Grün = richtiges Attribut.",
            helpYellow: "Gelb = teilweise richtig.",
            helpGray: "Grau = nicht richtig.",
            helpAttribs: '<strong>Attribute:</strong> Name, Seltenheit, Typ, Kosten, Farbe, Schlüsselw.',
            helpDaily: 'Täglich um <strong>00:00 UTC</strong> aktualisiert.',
            cost0: "0-Kosten",
            cost1: "1-Kosten",
            cost2: "2-Kosten",
            cost3: "3-Kosten",
            costX: "X-Kosten (variabel)",
            costStar: "Basis + Sternkosten",
            costStarVar: "Basis + variabler Stern",
            costUnplay: "Unspielbar (Status/Fluch)",
            modeDaily: "Täglich",
            modeRandom: "Zufall",
            modePast: "Vergangene Herausforderungen",
            newGame: "Neues Spiel",
            continueChallenge: "Fortsetzen",
            retryChallenge: "Wiederholen",
            historyTitle: "Vergangene Herausforderungen",
            streakLabel: "Serie",
            bestStreak: "Beste Serie",
            timeSpent: "Zeit",
        },
        fra: {
            title: "Spiredle",
            subtitle: "Slay the Spire 2 · Mot Wordle",
            lost: "Meilleure chance demain !",
            lostRandom: "Continuez !",
            select: "Choisir",
            pickerTitle: "Choisir une carte",
            pickerPlaceholder: "Rechercher nom ou ID...",
            cols: ["Nom", "Rareté", "Type", "Coût", "Couleur", "Mots-clés"],
            won: "Correct !",
            copy: "Copier les résultats",
            viewAnswer: "Voir la carte",
            clickToReveal: "Cliquer pour révéler",
            refTitle: "Référence de traduction",
            refRarity: "Rareté",
            refType: "Type",
            refColor: "Couleur",
            refKeywords: "Mots-clés",
            refCost: "Coût",
            themeTitle: "Thème",
            themeDark: "Sombre",
            themeLight: "Clair",
            themeSystem: "Système",
            helpTitle: "Comment jouer",
            helpIntro: "Devinez la carte <strong>Slay the Spire 2</strong> en <strong>6 essais</strong>.",
            helpEachGuess: "Chaque essai doit être une carte valide.",
            helpGreen: "Vert = attribut correct.",
            helpYellow: "Jaune = partiellement correct.",
            helpGray: "Gris = incorrect.",
            helpAttribs: "<strong>Attributs :</strong> Nom, Rareté, Type, Coût, Couleur, Mots-clés",
            helpDaily: "Mis à jour chaque jour à <strong>00:00 UTC</strong>.",
            cost0: "0-coût",
            cost1: "1-coût",
            cost2: "2-coût",
            cost3: "3-coût",
            costX: "Coût X (variable)",
            costStar: "Base + Coût étoile",
            costStarVar: "Base + Étoile variable",
            costUnplay: "Injouable (Statut/Malédiction)",
            modeDaily: "Quotidien",
            modeRandom: "Aléatoire",
            modePast: "Défis passés",
            newGame: "Nouvelle partie",
            continueChallenge: "Continuer",
            retryChallenge: "Réessayer",
            historyTitle: "Défis passés",
            streakLabel: "Série",
            bestStreak: "Meilleure série",
            timeSpent: "Temps",
        },
        esp: {
            title: "Spiredle",
            subtitle: "Slay the Spire 2 · Wordle de Cartas",
            lost: "¡Mejor suerte mañana!",
            lostRandom: "¡Sigue intentando!",
            select: "Elegir",
            pickerTitle: "Seleccionar carta",
            pickerPlaceholder: "Buscar nombre o ID...",
            cols: ["Nombre", "Rareza", "Tipo", "Coste", "Color", "Palabras cl."],
            won: "¡Correcto!",
            copy: "Copiar resultados",
            viewAnswer: "Ver carta",
            clickToReveal: "Hacer clic para revelar",
            refTitle: "Referencia de traducción",
            refRarity: "Rareza",
            refType: "Tipo",
            refColor: "Color",
            refKeywords: "Palabras cl.",
            refCost: "Coste",
            themeTitle: "Tema",
            themeDark: "Oscuro",
            themeLight: "Claro",
            themeSystem: "Sistema",
            helpTitle: "Cómo jugar",
            helpIntro: "Adivina la carta de <strong>Slay the Spire 2</strong> en <strong>6 intentos</strong>.",
            helpEachGuess: "Cada intento debe ser una carta válida.",
            helpGreen: "Verde = atributo correcto.",
            helpYellow: "Amarillo = parcialmente correcto.",
            helpGray: "Gris = incorrecto.",
            helpAttribs: "<strong>Atributos:</strong> Nombre, Rareza, Tipo, Coste, Color, Palabras cl.",
            helpDaily: "Se actualiza cada día a las <strong>00:00 UTC</strong>.",
            cost0: "0-coste",
            cost1: "1-coste",
            cost2: "2-coste",
            cost3: "3-coste",
            costX: "Coste X (variable)",
            costStar: "Base + Coste estrella",
            costStarVar: "Base + Estrella variable",
            costUnplay: "Injugable (Estado/Maldición)",
            modeDaily: "Diario",
            modeRandom: "Aleatorio",
            modePast: "Desafíos anteriores",
            newGame: "Nueva partida",
            continueChallenge: "Continuar",
            retryChallenge: "Reintentar",
            historyTitle: "Desafíos anteriores",
            streakLabel: "Racha",
            bestStreak: "Mejor racha",
            timeSpent: "Tiempo",
        },
        spa: {
            title: "Spiredle",
            subtitle: "Slay the Spire 2 · Wordle de Cartas",
            lost: "¡Mejor suerte mañana!",
            lostRandom: "¡Sigue intentando!",
            select: "Elegir",
            pickerTitle: "Seleccionar carta",
            pickerPlaceholder: "Buscar nombre o ID...",
            cols: ["Nombre", "Rareza", "Tipo", "Coste", "Color", "Palabras cl."],
            won: "¡Correcto!",
            copy: "Copiar resultados",
            viewAnswer: "Ver carta",
            clickToReveal: "Hacer clic para revelar",
            refTitle: "Referencia de traducción",
            refRarity: "Rareza",
            refType: "Tipo",
            refColor: "Color",
            refKeywords: "Palabras cl.",
            refCost: "Coste",
            themeTitle: "Tema",
            themeDark: "Oscuro",
            themeLight: "Claro",
            themeSystem: "Sistema",
            helpTitle: "Cómo jugar",
            helpIntro: "Adivina la carta de <strong>Slay the Spire 2</strong> en <strong>6 intentos</strong>.",
            helpEachGuess: "Cada intento debe ser una carta válida.",
            helpGreen: "Verde = atributo correcto.",
            helpYellow: "Amarillo = parcialmente correcto.",
            helpGray: "Gris = incorrecto.",
            helpAttribs: "<strong>Atributos:</strong> Nombre, Rareza, Tipo, Coste, Color, Palabras cl.",
            helpDaily: "Se actualiza cada día a las <strong>00:00 UTC</strong>.",
            cost0: "0-coste",
            cost1: "1-coste",
            cost2: "2-coste",
            cost3: "3-coste",
            costX: "Coste X (variable)",
            costStar: "Base + Coste estrella",
            costStarVar: "Base + Estrella variable",
            costUnplay: "Injugable (Estado/Maldición)",
            modeDaily: "Diario",
            modeRandom: "Aleatorio",
            modePast: "Desafíos anteriores",
            newGame: "Nueva partida",
            continueChallenge: "Continuar",
            retryChallenge: "Reintentar",
            historyTitle: "Desafíos anteriores",
            streakLabel: "Racha",
            bestStreak: "Mejor racha",
            timeSpent: "Tiempo",
        },
        ita: {
            title: "Spiredle",
            subtitle: "Slay the Spire 2 · Wordle di Carte",
            lost: "Meglio domani!",
            lostRandom: "Continua a provare!",
            select: "Scegli",
            pickerTitle: "Scegli una carta",
            pickerPlaceholder: "Cerca nome o ID...",
            cols: ["Nome", "Rarità", "Tipo", "Costo", "Colore", "Parole chiave"],
            won: "Corretto!",
            copy: "Copia risultati",
            viewAnswer: "Vedi carta",
            clickToReveal: "Clicca per rivelare",
            refTitle: "Riferimento traduzione",
            refRarity: "Rarità",
            refType: "Tipo",
            refColor: "Colore",
            refKeywords: "Parole chiave",
            refCost: "Costo",
            themeTitle: "Tema",
            themeDark: "Scuro",
            themeLight: "Chiaro",
            themeSystem: "Sistema",
            helpTitle: "Come giocare",
            helpIntro: "Indovina la carta di <strong>Slay the Spire 2</strong> in <strong>6 tentativi</strong>.",
            helpEachGuess: "Ogni tentativo deve essere una carta valida.",
            helpGreen: "Verde = attributo corretto.",
            helpYellow: "Giallo = parzialmente corretto.",
            helpGray: "Grigio = non corretto.",
            helpAttribs: "<strong>Attributi:</strong> Nome, Rarità, Tipo, Costo, Colore, Parole chiave",
            helpDaily: "Aggiornato ogni giorno alle <strong>00:00 UTC</strong>.",
            cost0: "0-costo",
            cost1: "1-costo",
            cost2: "2-costo",
            cost3: "3-costo",
            costX: "Costo X (variabile)",
            costStar: "Base + Costo stellare",
            costStarVar: "Base + Stella variabile",
            costUnplay: "Ingiocabile (Stato/Maledizione)",
            modeDaily: "デイリー",
            modeRandom: "ランダム",
            modePast: "過去のチャレンジ",
            newGame: "新しいゲーム",
            continueChallenge: "続ける",
            retryChallenge: "リトライ",
            historyTitle: "過去のチャレンジ",
            streakLabel: "連勝",
            bestStreak: "最高連勝",
            timeSpent: "時間",
        },
        jpn: {
            title: "Spiredle",
            subtitle: "Slay the Spire 2 · カードワードル",
            lost: "また明日挑戦しよう！",
            lostRandom: "頑張って！",
            select: "選択",
            pickerTitle: "カードを選択",
            pickerPlaceholder: "名前またはIDを検索...",
            cols: ["名前", "レア度", "タイプ", "コスト", "色", "キーワード"],
            won: "正解！",
            copy: "結果をコピー",
            viewAnswer: "カードを見る",
            clickToReveal: "クリックして表示",
            refTitle: "翻訳参考",
            refRarity: "レア度",
            refType: "タイプ",
            refColor: "色",
            refKeywords: "キーワード",
            refCost: "コスト",
            themeTitle: "テーマ",
            themeDark: "ダーク",
            themeLight: "ライト",
            themeSystem: "システム",
            helpTitle: "遊び方",
            helpIntro: "<strong>Slay the Spire 2</strong>のカードを<strong>6回</strong>で当てよう。",
            helpEachGuess: "各推測は有効なカードである必要があります。",
            helpGreen: "緑 = 正しい属性。",
            helpYellow: "黄 = 部分的に正しい。",
            helpGray: "灰 = 正しくない。",
            helpAttribs: "<strong>属性：</strong>名前、レア度、タイプ、コスト、色、キーワード",
            helpDaily: "毎日<strong>00:00 UTC</strong>に更新。",
            cost0: "0コスト",
            cost1: "1コスト",
            cost2: "2コスト",
            cost3: "3コスト",
            costX: "Xコスト（変動）",
            costStar: "ベース + スターコスト",
            costStarVar: "ベース + 変動スター",
            costUnplay: "プレイ不可（状態/呪い）",
            modeDaily: "デイリー",
            modeRandom: "ランダム",
            modePast: "過去のチャレンジ",
            newGame: "新しいゲーム",
            continueChallenge: "続ける",
            retryChallenge: "リトライ",
            historyTitle: "過去のチャレンジ",
            streakLabel: "連勝",
            bestStreak: "最高連勝",
            timeSpent: "時間",
        },
        kor: {
            title: "Spiredle",
            subtitle: "Slay the Spire 2 · 카드 워들",
            lost: "내일 다시 도전하세요!",
            lostRandom: "계속 도전하세요!",
            select: "선택",
            pickerTitle: "카드 선택",
            pickerPlaceholder: "이름 또는 ID 검색...",
            cols: ["이름", "희귀도", "유형", "비용", "색상", "키워드"],
            won: "정답!",
            copy: "결과 복사",
            viewAnswer: "카드 보기",
            clickToReveal: "클릭하여 공개",
            refTitle: "번역 참조",
            refRarity: "희귀도",
            refType: "유형",
            refColor: "색상",
            refKeywords: "키워드",
            refCost: "비용",
            themeTitle: "테마",
            themeDark: "다크",
            themeLight: "라이트",
            themeSystem: "시스템",
            helpTitle: "게임 방법",
            helpIntro: "<strong>Slay the Spire 2</strong> 카드를 <strong>6번</strong> 안에 맞춰보세요.",
            helpEachGuess: "각 추측은 유효한 카드여야 합니다.",
            helpGreen: "초록 = 올바른 속성.",
            helpYellow: "노랑 = 부분적으로 올바름.",
            helpGray: "회색 = 올바르지 않음.",
            helpAttribs: "<strong>속성:</strong> 이름, 희귀도, 유형, 비용, 색상, 키워드",
            helpDaily: "매일 <strong>00:00 UTC</strong>에 업데이트됩니다.",
            cost0: "0비용",
            cost1: "1비용",
            cost2: "2비용",
            cost3: "3비용",
            costX: "X비용 (가변)",
            costStar: "기본 + 별 비용",
            costStarVar: "기본 + 가변 별",
            costUnplay: "플레이 불가 (상태/저주)",
            modeDaily: "데일리",
            modeRandom: "랜덤",
            modePast: "지난 도전",
            newGame: "새 게임",
            continueChallenge: "계속",
            retryChallenge: "재도전",
            historyTitle: "지난 도전",
            streakLabel: "연승",
            bestStreak: "최고 연승",
            timeSpent: "시간",
        },
        pol: {
            title: "Spiredle",
            subtitle: "Slay the Spire 2 · Wordle Kart",
            lost: "Lepiej jutro!",
            lostRandom: "Próbuj dalej!",
            select: "Wybierz",
            pickerTitle: "Wybierz kartę",
            pickerPlaceholder: "Szukaj nazwy lub ID...",
            cols: ["Nazwa", "Rzadkość", "Typ", "Koszt", "Kolor", "Słowa klucz."],
            won: "Poprawnie!",
            copy: "Kopiuj wyniki",
            viewAnswer: "Zobacz kartę",
            clickToReveal: "Kliknij, aby odkryć",
            refTitle: "Tłumaczenie",
            refRarity: "Rzadkość",
            refType: "Typ",
            refColor: "Kolor",
            refKeywords: "Słowa klucz.",
            refCost: "Koszt",
            themeTitle: "Motyw",
            themeDark: "Ciemny",
            themeLight: "Jasny",
            themeSystem: "System",
            helpTitle: "Jak grać",
            helpIntro: "Zgadnij kartę z <strong>Slay the Spire 2</strong> w <strong>6 próbach</strong>.",
            helpEachGuess: "Każda próba musi być poprawną kartą.",
            helpGreen: "Zielony = poprawny atrybut.",
            helpYellow: "Żółty = częściowo poprawny.",
            helpGray: "Szary = niepoprawny.",
            helpAttribs: "<strong>Atrybuty:</strong> Nazwa, Rzadkość, Typ, Koszt, Kolor, Słowa klucz.",
            helpDaily: "Aktualizowane codziennie o <strong>00:00 UTC</strong>.",
            cost0: "0-koszt",
            cost1: "1-koszt",
            cost2: "2-koszt",
            cost3: "3-koszt",
            costX: "Koszt X (zmienny)",
            costStar: "Baza + Koszt gwiazdy",
            costStarVar: "Baza + Zmienna gwiazda",
            costUnplay: "Nie do zagrania (Stan/Klątwa)",
            modeDaily: "Codziennie",
            modeRandom: "Losowo",
            modePast: "Poprzednie wyzwania",
            newGame: "Nowa gra",
            continueChallenge: "Kontynuuj",
            retryChallenge: "Spróbuj ponownie",
            historyTitle: "Poprzednie wyzwania",
            streakLabel: "Seria",
            bestStreak: "Najlepsza seria",
            timeSpent: "Czas",
        },
        ptb: {
            title: "Spiredle",
            subtitle: "Slay the Spire 2 · Wordle de Cartas",
            lost: "Melhor sorte amanhã!",
            lostRandom: "Continue tentando!",
            select: "Procurar",
            pickerTitle: "Selecionar carta",
            pickerPlaceholder: "Buscar nome ou ID...",
            cols: ["Nome", "Raridade", "Tipo", "Custo", "Cor", "Palavras-chave"],
            won: "Correto!",
            copy: "Copiar resultados",
            viewAnswer: "Ver carta",
            clickToReveal: "Clique para revelar",
            refTitle: "Referência de tradução",
            refRarity: "Raridade",
            refType: "Tipo",
            refColor: "Cor",
            refKeywords: "Palavras-chave",
            refCost: "Custo",
            themeTitle: "Tema",
            themeDark: "Escuro",
            themeLight: "Claro",
            themeSystem: "Sistema",
            helpTitle: "Como jogar",
            helpIntro: "Adivinhe a carta de <strong>Slay the Spire 2</strong> em <strong>6 tentativas</strong>.",
            helpEachGuess: "Cada tentativa deve ser uma carta válida.",
            helpGreen: "Verde = atributo correto.",
            helpYellow: "Amarelo = parcialmente correto.",
            helpGray: "Cinza = incorreto.",
            helpAttribs: "<strong>Atributos:</strong> Nome, Raridade, Tipo, Custo, Cor, Palavras-chave",
            helpDaily: "Atualizado diariamente às <strong>00:00 UTC</strong>.",
            cost0: "0-custo",
            cost1: "1-custo",
            cost2: "2-custo",
            cost3: "3-custo",
            costX: "Custo X (variável)",
            costStar: "Base + Custo estrela",
            costStarVar: "Base + Estrela variável",
            costUnplay: "Injogável (Estado/Maldição)",
            modeDaily: "Diário",
            modeRandom: "Aleatório",
            modePast: "Desafios anteriores",
            newGame: "Novo jogo",
            continueChallenge: "Continuar",
            retryChallenge: "Tentar novamente",
            historyTitle: "Desafios anteriores",
            streakLabel: "Sequência",
            bestStreak: "Melhor sequência",
            timeSpent: "Tempo",
        },
        rus: {
            title: "Spiredle",
            subtitle: "Slay the Spire 2 · Wordle",
            lost: "Повезёт завтра!",
            lostRandom: "Продолжай пытаться!",
            select: "Выбрать",
            pickerTitle: "Выбрать карту",
            pickerPlaceholder: "Поиск имени или ID...",
            cols: ["Имя", "Редкость", "Тип", "Стоимость", "Цвет", "Ключ. слова"],
            won: "Верно!",
            copy: "Копировать результат",
            viewAnswer: "Посмотреть карту",
            clickToReveal: "Нажмите, чтобы открыть",
            refTitle: "Справочник переводов",
            refRarity: "Редкость",
            refType: "Тип",
            refColor: "Цвет",
            refKeywords: "Ключ. слова",
            refCost: "Стоимость",
            themeTitle: "Тема",
            themeDark: "Тёмная",
            themeLight: "Светлая",
            themeSystem: "Система",
            helpTitle: "Как играть",
            helpIntro: "Угадайте карту из <strong>Slay the Spire 2</strong> за <strong>6 попыток</strong>.",
            helpEachGuess: "Каждая попытка должна быть действительной картой.",
            helpGreen: "Зелёный = верный атрибут.",
            helpYellow: "Жёлтый = частично верно.",
            helpGray: "Серый = неверно.",
            helpAttribs: "<strong>Атрибуты:</strong> Имя, Редкость, Тип, Стоимость, Цвет, Ключ. слова",
            helpDaily: "Обновляется ежедневно в <strong>00:00 UTC</strong>.",
            cost0: "0-стоимость",
            cost1: "1-стоимость",
            cost2: "2-стоимость",
            cost3: "3-стоимость",
            costX: "X-стоимость (переменная)",
            costStar: "База + Звёздная стоимость",
            costStarVar: "База + Переменная звезда",
            costUnplay: "Нельзя разыграть (Состояние/Проклятие)",
            modeDaily: "Ежедневно",
            modeRandom: "Случайно",
            modePast: "Прошлые испытания",
            newGame: "Новая игра",
            continueChallenge: "Продолжить",
            retryChallenge: "Повторить",
            historyTitle: "Прошлые испытания",
            streakLabel: "Серия",
            bestStreak: "Лучшая серия",
            timeSpent: "Время",
        },
        tha: {
            title: "Spiredle",
            subtitle: "Slay the Spire 2 · Wordle",
            lost: "โชคดีพรุ่งนี้!",
            lostRandom: "พยายามต่อไป!",
            select: "เลือก",
            pickerTitle: "เลือกการ์ด",
            pickerPlaceholder: "ค้นหาชื่อหรือ ID...",
            cols: ["ชื่อ", "ความหายาก", "ประเภท", "ค่าใช้จ่าย", "สี", "คำสำคัญ"],
            won: "ถูกต้อง!",
            copy: "คัดลอกผลลัพธ์",
            viewAnswer: "ดูการ์ด",
            clickToReveal: "คลิกเพื่อเปิดเผย",
            refTitle: "การอ้างอิงการแปล",
            refRarity: "ความหายาก",
            refType: "ประเภท",
            refColor: "สี",
            refKeywords: "คำสำคัญ",
            refCost: "ค่าใช้จ่าย",
            themeTitle: "ธีม",
            themeDark: "มืด",
            themeLight: "สว่าง",
            themeSystem: "ระบบ",
            helpTitle: "วิธีเล่น",
            helpIntro: "ทายการ์ด <strong>Slay the Spire 2</strong> ใน <strong>6 ครั้ง</strong>",
            helpEachGuess: "แต่ละครั้งต้องเป็นการ์ดที่ถูกต้อง",
            helpGreen: "สีเขียว = คุณสมบัติถูกต้อง",
            helpYellow: "สีเหลือง = ถูกต้องบางส่วน",
            helpGray: "สีเทา = ไม่ถูกต้อง",
            helpAttribs: "<strong>คุณสมบัติ:</strong> ชื่อ, ความหายาก, ประเภท, ค่าใช้จ่าย, สี, คำสำคัญ",
            helpDaily: "อัปเดตทุกวันที่ <strong>00:00 UTC</strong>",
            cost0: "0 ค่าใช้จ่าย",
            cost1: "1 ค่าใช้จ่าย",
            cost2: "2 ค่าใช้จ่าย",
            cost3: "3 ค่าใช้จ่าย",
            costX: "X ค่าใช้จ่าย (แปรผัน)",
            costStar: "ฐาน + ค่าใช้จ่ายดาว",
            costStarVar: "ฐาน + ดาวแปรผัน",
            costUnplay: "ไม่สามารถเล่นได้ (สถานะ/คำสาป)",
            modeDaily: "รายวัน",
            modeRandom: "สุ่ม",
            modePast: "ความท้าทายที่ผ่านมา",
            newGame: "เกมใหม่",
            continueChallenge: "ต่อไป",
            retryChallenge: "ลองอีกครั้ง",
            historyTitle: "ความท้าทายที่ผ่านมา",
            streakLabel: " streak",
            bestStreak: " best streak",
            timeSpent: "เวลา",
        },
        tur: {
            title: "Spiredle",
            subtitle: "Slay the Spire 2 · Kelime Oyunu",
            lost: "Yarın daha iyi şanslar!",
            lostRandom: "Denemeye devam et!",
            select: "Seç",
            pickerTitle: "Kart Seç",
            pickerPlaceholder: "İsim veya ID ara...",
            cols: ["İsim", "Nadirlik", "Tür", "Maliyet", "Renk", "Anahtar kelim."],
            won: "Doğru!",
            copy: "Sonuçları Kopyala",
            viewAnswer: "Kartı Gör",
            clickToReveal: "Açıklamak için tıklayın",
            refTitle: "Çeviri Referansı",
            refRarity: "Nadirlik",
            refType: "Tür",
            refColor: "Renk",
            refKeywords: "Anahtar kelim.",
            refCost: "Maliyet",
            themeTitle: "Tema",
            themeDark: "Koyu",
            themeLight: "Açık",
            themeSystem: "Sistem",
            helpTitle: "Nasıl Oynanır",
            helpIntro: "<strong>Slay the Spire 2</strong> kartını <strong>6 denemede</strong> tahmin edin.",
            helpEachGuess: "Her tahmin geçerli bir kart olmalıdır.",
            helpGreen: "Yeşil = doğru özellik.",
            helpYellow: "Sarı = kısmen doğru.",
            helpGray: "Gri = doğru değil.",
            helpAttribs: "<strong>Özellikler:</strong> İsim, Nadirlik, Tür, Maliyet, Renk, Anahtar kelim.",
            helpDaily: "Her gün <strong>00:00 UTC</strong>'de güncellenir.",
            cost0: "0-maliyet",
            cost1: "1-maliyet",
            cost2: "2-maliyet",
            cost3: "3-maliyet",
            costX: "X-maliyet (değişken)",
            costStar: "Taban + Yıldız maliyeti",
            costStarVar: "Taban + Değişken yıldız",
            costUnplay: "Oynanamaz (Durum/Lanet)",
            modeDaily: "Günlük",
            modeRandom: "Rastgele",
            modePast: "Geçmiş mücadeleler",
            newGame: "Yeni oyun",
            continueChallenge: "Devam et",
            retryChallenge: "Tekrar dene",
            historyTitle: "Geçmiş mücadeleler",
            streakLabel: "Seri",
            bestStreak: "En iyi seri",
            timeSpent: "Süre",
        },
    };

    function t(key) { return (UI[state.lang] && UI[state.lang][key]) || (UI["eng"][key] || key); }
    function tCol(idx) { const a = (UI[state.lang] && UI[state.lang].cols) || UI["eng"].cols; return a[idx] || UI["eng"].cols[idx]; }

    // ---- State -----------------------------------------------------------
    const state = {
        lang: "eng",
        date: "",
        maxGuesses: 7,
        startTime: null,
        guesses: [],
        won: false,
        gameOver: false,
        answer: null,
        cards: [],
        currentRow: 0,
        selectedCard: null,
        mode: "daily",
    };

    // ---- Local Storage Keys ----------------------------------------------
    const LS_STREAK = "spiredle-random-streak";
    const LS_BEST_STREAK = "spiredle-random-best-streak";

    function getStreak() {
        return parseInt(localStorage.getItem(LS_STREAK) || "0", 10);
    }
    function setStreak(v) {
        localStorage.setItem(LS_STREAK, String(v));
    }
    function getBestStreak() {
        return parseInt(localStorage.getItem(LS_BEST_STREAK) || "0", 10);
    }
    function setBestStreak(v) {
        localStorage.setItem(LS_BEST_STREAK, String(v));
    }

    // ---- Random Mode (localStorage-based) --------------------------------
    const LS_RANDOM_STATE = "spiredle-random-state";
    const LS_BEST_STREAK_TIME = "spiredle-random-best-streak-time";

    function getBestStreakTime() {
        return parseInt(localStorage.getItem(LS_BEST_STREAK_TIME) || "0", 10);
    }
    function setBestStreakTime(v) {
        localStorage.setItem(LS_BEST_STREAK_TIME, String(v));
    }

    function _saveRandomState() {
        const data = {
            answer: state.randomAnswer,
            guesses: state.guesses,
            won: state.won,
            gameOver: state.gameOver,
            startTime: state.startTime,
            sessionTime: state.sessionTime || 0,
        };
        localStorage.setItem(LS_RANDOM_STATE, JSON.stringify(data));
    }

    function _loadRandomState() {
        try {
            const raw = localStorage.getItem(LS_RANDOM_STATE);
            if (!raw) return false;
            const data = JSON.parse(raw);
            if (!data.answer) return false;
            state.randomAnswer = data.answer;
            state.guesses = data.guesses || [];
            state.won = data.won || false;
            state.gameOver = data.gameOver || false;
            state.startTime = data.startTime || null;
            state.sessionTime = data.sessionTime || 0;
            state.currentRow = state.guesses.length;
            return true;
        } catch { return false; }
    }

    function _clearRandomState() {
        localStorage.removeItem(LS_RANDOM_STATE);
    }

    // ---- Evaluation functions (ported from Python) -----------------------
    function _evalName(guessCard, answerCard) {
        return guessCard.id === answerCard.id ? "correct" : "absent";
    }
    function _evalRarity(guessCard, answerCard) {
        return guessCard.rarity === answerCard.rarity ? "correct" : "absent";
    }
    function _evalType(guessCard, answerCard) {
        return guessCard.type === answerCard.type ? "correct" : "absent";
    }
    function _evalCost(guessCard, answerCard) {
        const g = guessCard, a = answerCard;
        // X cost
        if (g.is_x_cost && a.is_x_cost) {
            return g.star_cost === a.star_cost ? "correct" : "yellow";
        }
        // Star cost
        const hasStar = (g.star_cost != null) || (a.star_cost != null);
        if (hasStar) {
            const costMatch = g.cost === a.cost;
            const starMatch = g.star_cost === a.star_cost;
            if (costMatch && starMatch) return "correct";
            if (costMatch) return "yellow";
            return "absent";
        }
        // One X, other not
        if (g.is_x_cost !== a.is_x_cost) return "absent";
        // Normal cost
        if (g.cost === a.cost) return "correct";
        return "absent";
    }
    function _evalColor(guessCard, answerCard) {
        return guessCard.color === answerCard.color ? "correct" : "absent";
    }
    function _evalKeywords(guessCard, answerCard) {
        const gk = (guessCard.keywords || []).sort().join(",");
        const ak = (answerCard.keywords || []).sort().join(",");
        if (!gk && !ak) return "correct";
        if (!gk || !ak) return "absent";
        if (gk === ak) return "correct";
        // Check overlap
        const gSet = new Set(guessCard.keywords);
        const aSet = new Set(answerCard.keywords);
        for (const k of gSet) { if (aSet.has(k)) return "yellow"; }
        return "absent";
    }
    function _evaluateGuess(guessCard, answerCard) {
        return {
            name: _evalName(guessCard, answerCard),
            rarity: _evalRarity(guessCard, answerCard),
            type: _evalType(guessCard, answerCard),
            cost: _evalCost(guessCard, answerCard),
            color: _evalColor(guessCard, answerCard),
            keywords: _evalKeywords(guessCard, answerCard),
        };
    }

    // ---- DOM refs --------------------------------------------------------
    const board = document.getElementById("board");
    const guessBtn = document.getElementById("guessBtn");
    const hint = document.getElementById("hint");
    const result = document.getElementById("result");
    const dateDisplay = document.querySelector(".date-display");
    const selectedNameEl = document.getElementById("selectedCardName");
    const titleEl = document.querySelector(".title");
    const subtitleEl = document.querySelector(".subtitle");

    // Mode toggle
    const modeToggle = document.getElementById("modeToggle");
    const modeBtns = modeToggle?.querySelectorAll(".mode-btn");
    const streakDisplay = document.getElementById("streakDisplay");
    const streakCount = document.getElementById("streakCount");

    // Card picker
    const pickerModal = document.getElementById("cardPickerModal");
    const pickerSearch = document.getElementById("pickerSearch");
    const pickerGrid = document.getElementById("pickerGrid");
    const pickerCount = document.getElementById("pickerCount");
    const pickerClose = document.getElementById("pickerClose");
    const pickerTitleEl = pickerModal?.querySelector("h2");

    // ---- Init ------------------------------------------------------------
    async function init(mode) {
        const params = new URLSearchParams(window.location.search);
        state.lang = params.get("lang") || "eng";

        // Fetch localization data from backend (uses local files)
        await loadLocalization();

        // Apply UI translations
        applyUITranslations();

        // Theme
        initTheme();

        // Mode toggle buttons
        setupModeToggle();

        state.mode = mode || "daily";
        _updateModeUI();

        if (state.mode === "random") {
            await initRandom();
        } else {
            await initDaily();
        }
    }

    async function initDaily() {
        try {
            const res = await fetch(`/api/init?lang=${state.lang}`);
            const data = await res.json();

            state.date = data.date;
            state.maxGuesses = data.maxGuesses;
            state.guesses = data.guesses || [];
            state.won = data.won;
            state.gameOver = data.gameOver;
            state.currentRow = state.guesses.length;

            // Fetch full answer card if game is over
            if (state.gameOver) {
                try {
                    const ansRes = await fetch(`/api/today?lang=${state.lang}`);
                    state.answer = await ansRes.json();
                } catch { state.answer = null; }
            } else {
                state.answer = null;
            }

            dateDisplay.textContent = data.date;

            await loadCards();
            buildBoard();
            renderAllGuesses();

            if (state.gameOver) {
                disableInput();
                if (state.won) showWin();
                else showLose();
            }
        } catch (err) {
            console.error("Init failed:", err);
            hint.textContent = "Failed to load game. Try refreshing.";
        }
    }

    async function initRandom(newGame) {
        try {
            await loadCards();

            // Clear previous game over overlay
            result.innerHTML = "";
            state.selectedCard = null;
            _updateSelectedDisplay();

            // Try loading existing state from localStorage
            let loaded = false;
            if (!newGame) {
                loaded = _loadRandomState();
            }

            if (newGame || !loaded) {
                // Fetch a new random card from server
                const res = await fetch(`/api/random?lang=${state.lang}`);
                const data = await res.json();
                state.randomAnswer = data.card;
                state.guesses = [];
                state.won = false;
                state.gameOver = false;
                state.currentRow = 0;
                state.startTime = Date.now();
                _saveRandomState();
            }

            state.date = "Random";
            state.maxGuesses = 7;
            state.answer = state.gameOver ? state.randomAnswer : null;

            dateDisplay.textContent = "🔥 " + t("modeRandom");

            buildBoard();
            renderAllGuesses();
            _updateStreakUI();

            if (state.gameOver) {
                disableInput();
                if (state.won) showWin();
                else showLose();
            } else {
                enableInput();
            }
        } catch (err) {
            console.error("Random init failed:", err);
            hint.textContent = "Failed to load random game. Try refreshing.";
        }
    }

    function enableInput() {
        guessBtn.disabled = false;
    }

    // ---- Mode Switching --------------------------------------------------
    function setupModeToggle() {
        if (!modeBtns) return;
        modeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const newMode = btn.dataset.mode;
                if (newMode === "past") {
                    // Past challenges: open modal
                    document.getElementById("historyModal").classList.add("active");
                    buildHistoryList();
                    return;
                }
                if (newMode === state.mode) return;
                switchMode(newMode);
            });
        });
    }

    function switchMode(newMode) {
        state.mode = newMode;
        _updateModeUI();

        // Reset game UI
        result.innerHTML = "";
        hint.textContent = "";
        state.selectedCard = null;
        _updateSelectedDisplay();

        if (newMode === "random") {
            streakDisplay.style.display = "flex";
            initRandom(true);
        } else {
            streakDisplay.style.display = "none";
            initDaily();
        }
    }

    function _updateModeUI() {
        if (!modeBtns) return;
        modeBtns.forEach(btn => {
            const isActive = btn.dataset.mode === state.mode;
            btn.classList.toggle("mode-active", isActive);
        });
        // Update toggle button texts based on language
        if (modeBtns.length >= 2) {
            modeBtns[0].textContent = t("modeDaily");
            modeBtns[1].textContent = t("modeRandom");
        }
        if (modeBtns.length >= 3) {
            modeBtns[2].textContent = t("modePast");
        }
    }

    async function loadLocalization() {
        try {
            const res = await fetch(`/api/localization?lang=${state.lang}`);
            const data = await res.json();
            locData = data;
        } catch (err) {
            console.error("Failed to load localization:", err);
        }
    }

    function applyUITranslations() {
        titleEl.textContent = t("title");
        // Subtitle: replace text but keep the date span
        const dateSpan = subtitleEl.querySelector(".date-display");
        subtitleEl.textContent = t("subtitle");
        if (dateSpan) subtitleEl.appendChild(dateSpan);
        guessBtn.textContent = t("select");
        pickerSearch.placeholder = t("pickerPlaceholder");
        if (pickerTitleEl) pickerTitleEl.textContent = t("pickerTitle");
        // Mode toggle labels
        if (modeBtns && modeBtns.length >= 2) {
            modeBtns[0].textContent = t("modeDaily");
            modeBtns[1].textContent = t("modeRandom");
        }

        // Theme modal
        byId("themeModalTitle", el => el.textContent = t("themeTitle"));
        byId("themeDark", el => el.textContent = t("themeDark"));
        byId("themeLight", el => el.textContent = t("themeLight"));
        byId("themeSystem", el => el.textContent = t("themeSystem"));

        // Reference modal title
        byId("refModalTitle", el => el.textContent = t("refTitle"));

        // Help modal
        byId("helpModalTitle", el => el.textContent = t("helpTitle"));
        byId("helpIntro", el => el.innerHTML = t("helpIntro"));
        byId("helpEachGuess", el => el.textContent = t("helpEachGuess"));
        byId("helpGreen", el => el.textContent = t("helpGreen"));
        byId("helpYellow", el => el.textContent = t("helpYellow"));
        byId("helpGray", el => el.textContent = t("helpGray"));
        byId("helpAttribs", el => el.innerHTML = t("helpAttribs"));
        byId("helpDaily", el => el.innerHTML = t("helpDaily"));

        hint.textContent = "";
        _updateSelectedDisplay();
    }

    function byId(id, fn) {
        const el = document.getElementById(id);
        if (el) fn(el);
    }

    function _updateSelectedDisplay() {
        if (state.selectedCard) {
            selectedNameEl.textContent = state.selectedCard.name;
            selectedNameEl.classList.add("has-card");
            guessBtn.textContent = "> " + state.selectedCard.name;
        } else {
            selectedNameEl.textContent = "";
            selectedNameEl.classList.remove("has-card");
            guessBtn.textContent = t("select");
        }
    }

    // ---- Theme -----------------------------------------------------------
    function initTheme() {
        const saved = localStorage.getItem("spiredle-theme") || "dark";
        applyTheme(saved);
        // Mark active button
        document.querySelectorAll(".theme-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.themeVal === saved);
        });
    }

    function applyTheme(theme) {
        if (theme === "system") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
        } else {
            document.documentElement.setAttribute("data-theme", theme);
        }
        localStorage.setItem("spiredle-theme", theme);
    }

    document.querySelectorAll(".theme-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const val = btn.dataset.themeVal;
            document.querySelectorAll(".theme-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            applyTheme(val);
        });
    });

    // Listen for system theme changes when in "system" mode
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        const saved = localStorage.getItem("spiredle-theme");
        if (saved === "system") applyTheme("system");
    });

    // ---- Load Cards ------------------------------------------------------
    async function loadCards() {
        const res = await fetch(`/api/cards?lang=${state.lang}`);
        state.cards = await res.json();
    }

    // ---- Board -----------------------------------------------------------
    function buildBoard() {
        board.innerHTML = "";
        const labels = [0, 1, 2, 3, 4, 5];
        const labelRow = document.createElement("div");
        labelRow.className = "row";
        for (const idx of labels) {
            const el = document.createElement("div");
            el.className = "tile tile-empty";
            el.style.border = "none";
            el.style.fontSize = "10px";
            el.style.fontWeight = "600";
            el.style.color = "#888";
            el.style.textTransform = "uppercase";
            el.style.letterSpacing = "0.5px";
            el.textContent = tCol(idx);
            labelRow.appendChild(el);
        }
        board.appendChild(labelRow);

        for (let i = 0; i < state.maxGuesses; i++) {
            const row = document.createElement("div");
            row.className = "row";
            row.id = `row-${i}`;
            for (let j = 0; j < 6; j++) {
                const tile = document.createElement("div");
                tile.className = "tile tile-empty";
                tile.id = `tile-${i}-${j}`;
                row.appendChild(tile);
            }
            board.appendChild(row);
        }
    }

    function renderAllGuesses() {
        for (let i = 0; i < state.guesses.length; i++) {
            const guess = state.guesses[i];
            const evals = guess.evaluations || null;
            if (evals) renderRow(i, guess, evals);
        }
    }

    // ---- Streak Tracking -------------------------------------------------
    function _updateStreakUI() {
        const s = getStreak();
        const bs = getBestStreak();
        if (streakCount) streakCount.textContent = s;
        if (streakDisplay) {
            streakDisplay.style.display = "flex";
            streakDisplay.title = `${t("streakLabel")}: ${s} · ${t("bestStreak")}: ${bs}`;
        }
    }

    function _addWinToStreak() {
        const s = getStreak() + 1;
        setStreak(s);
        const bs = getBestStreak();
        // Add current game time to session time
        const elapsed = state.startTime ? Date.now() - state.startTime : 0;
        state.sessionTime = (state.sessionTime || 0) + elapsed;
        if (s > bs) {
            setBestStreak(s);
            setBestStreakTime(state.sessionTime);
        } else if (s === bs && bs > 0) {
            // Same streak count: keep the faster time
            const curBestTime = getBestStreakTime();
            if (curBestTime === 0 || state.sessionTime < curBestTime) {
                setBestStreakTime(state.sessionTime);
            }
        }
        _updateStreakUI();
    }

    function _resetStreak() {
        // Capture the streak before reset so it can be shown in the lose screen
        state.roundStreak = getStreak();
        // Time from failed round does NOT count toward session/streak time
        setStreak(0);
        _updateStreakUI();
    }

    // ---- Make a Guess ----------------------------------------------------
    async function makeGuess(cardId) {
        if (state.gameOver) return;
        if (!cardId) return;

        hint.textContent = "";
        closePicker();

        const isLocalEval = state.mode === "random" || state.mode === "past";

        if (isLocalEval) {
            // ---- Local evaluation mode (random or past) ------------------
            // Fetch full card data for the guess
            let guessCard;
            try {
                const res = await fetch(`/api/card/${cardId}?lang=${state.lang}`);
                guessCard = await res.json();
            } catch { }
            if (!guessCard || guessCard.error) {
                hint.textContent = "Card not found";
                return;
            }
            const answerCard = state.randomAnswer;
            const evals = _evaluateGuess(guessCard, answerCard);
            const isCorrect = guessCard.id === answerCard.id;

            const rowIdx = state.currentRow;
            renderRow(rowIdx, guessCard, evals);

            const guessEntry = { ...guessCard, evaluations: evals };
            state.guesses.push(guessEntry);
            state.currentRow++;
            state.selectedCard = null;
            _updateSelectedDisplay();

            if (isCorrect) {
                state.won = true;
                state.gameOver = true;
                state.answer = answerCard;
                disableInput();
                if (state.mode === "random") {
                    _addWinToStreak();
                    _saveRandomState();
                } else if (state.mode === "past") {
                    _saveHistoryEntry(state.date, { won: true, guesses: state.currentRow });
                }
                showWin();
            } else if (state.currentRow >= state.maxGuesses) {
                state.gameOver = true;
                state.answer = answerCard;
                disableInput();
                if (state.mode === "random") {
                    _resetStreak();
                    _saveRandomState();
                } else if (state.mode === "past") {
                    _saveHistoryEntry(state.date, { won: false, guesses: state.currentRow });
                }
                showLose();
            } else {
                if (state.mode === "random") _saveRandomState();
            }
            return;
        }

        // ---- Daily mode: server-side -------------------------------------
        try {
            const res = await fetch("/api/guess", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: cardId, lang: state.lang }),
            });

            const data = await res.json();

            if (data.error) {
                hint.textContent = data.error;
                return;
            }

            const rowIdx = state.currentRow;
            const guess = data.guess;
            const evals = data.evaluations;

            renderRow(rowIdx, guess, evals);

            guess.evaluations = evals;
            state.guesses.push(guess);
            state.currentRow++;
            state.selectedCard = null;
            _updateSelectedDisplay();

            if (data.is_correct) {
                state.won = true;
                state.gameOver = true;
                state.answer = data.answer;
                disableInput();
                _saveHistoryEntry(state.date, { won: true, guesses: state.currentRow });
                showWin();
            } else if (state.currentRow >= state.maxGuesses) {
                state.gameOver = true;
                disableInput();
                showLose();
            }
        } catch (err) {
            console.error("Guess failed:", err);
            hint.textContent = "Network error. Try again.";
        }
    }

    function tKeyword(key) {
        return (locData.keywords && locData.keywords[key.toUpperCase()]) || key;
    }

    function renderRow(rowIdx, guess, evals) {
        const fields = [
            { key: "name", label: guess.local_name || guess.name || guess.id },
            { key: "rarity", label: tRarity(guess.rarity) },
            { key: "type", label: tType(guess.type) },
            { key: "cost", label: guess.display_cost || String(guess.cost ?? "?") },
            { key: "color", label: tColor(guess.color) },
            { key: "keywords", label: (guess.keywords || []).map(tKeyword).join(", ") || "—" },
        ];

        for (let j = 0; j < 6; j++) {
            const tile = document.getElementById(`tile-${rowIdx}-${j}`);
            const field = fields[j];
            const status = evals[field.key] || "absent";
            tile.textContent = field.label;
            tile.className = `tile tile-${status} tile-pop`;
        }
    }

    // ---- End Game States -------------------------------------------------
    function disableInput() {
        guessBtn.disabled = true;
    }

    function buildShareText() {
        const emojiMap = { correct: "🟩", yellow: "🟨", absent: "⬜" };
        const domain = window.location.origin;
        const isRandom = state.mode === "random";
        const isPast = state.mode === "past";
        const modeLabel = isRandom ? "Random" : (isPast ? "Review" : "Daily");

        if (isRandom) {
            // Random mode: streak + time format
            const curStreak = state.won ? getStreak() : 0;
            const bestStreak = getBestStreak();
            // Best streak uses stored best time; current streak uses session time
            const bestTimeMs = getBestStreakTime();
            const sessionTimeMs = state.sessionTime || 0;
            const fmt = (ms) => { const m = Math.floor(ms / 60000); const s = Math.floor((ms % 60000) / 1000); return m > 0 ? `${m}m ${s}s` : `${s}s`; };
            return `Spiredle ${modeLabel}\n${t("bestStreak")}: ${bestStreak}，${t("timeSpent")}: ${fmt(bestTimeMs)}\n${t("streakLabel")}: ${curStreak}，${t("timeSpent")}: ${fmt(sessionTimeMs)}\n${domain}`;
        }

        // Daily / Past mode: score + emoji grid format
        const won = state.won;
        const score = won ? `${state.currentRow}/${state.maxGuesses}` : `-/${state.maxGuesses}`;
        let text = `Spiredle ${modeLabel} - ${score}\n`;
        for (const g of state.guesses) {
            const ev = g.evaluations;
            if (!ev) continue;
            const order = ["name", "rarity", "type", "cost", "color", "keywords"];
            for (const k of order) {
                text += emojiMap[ev[k]] || "⬜";
            }
            text += "\n";
        }
        return text.trim() + `\n${domain}`;
    }
    window.buildShareText = buildShareText;

    function showWin() {
        if (!state.answer) return;
        const ans = state.answer;
        const cName = ans.local_name || ans.name;
        const cImg = ans.image_url;
        const cRarity = tRarity(ans.rarity);
        const cType = tType(ans.type);
        const cCost = ans.display_cost;
        const cColor = tColor(ans.color);
        const showStreakNext = state.mode === "random";
        const streakInfo = showStreakNext ? `<p style="font-size:14px;color:var(--yellow);margin-bottom:8px">🔥 ${t("streakLabel")}: ${getStreak()}</p>` : "";
        const actionBtn = showStreakNext
            ? `<button class="btn-share" id="actionBtn">${t("continueChallenge")}</button>`
            : "";
        result.innerHTML = `
      <p style="font-size:20px;font-weight:700;color:var(--green);margin-bottom:8px">${t("won")}</p>
      ${streakInfo}
      <div id="answerReveal" class="card-reveal">
        ${cImg ? `<img src="${cImg}" alt="${cName}" class="reveal-card-img">` : ""}
        <div class="card-name">${cName}</div>
        <div class="card-detail">${cRarity} · ${cType} · ${t("refCost")} ${cCost} · ${cColor}</div>
      </div>
      <div class="result-buttons">
        ${actionBtn}
        <button class="btn-share" onclick="navigator.clipboard.writeText(buildShareText());this.textContent='${t("copy")} ✓'">${t("copy")}</button>
      </div>`;
        const ab = document.getElementById("actionBtn");
        if (ab) ab.addEventListener("click", () => { _clearRandomState(); initRandom(true); });
    }

    function showLose() {
        if (state.answer) {
            renderLose(state.answer);
            return;
        }
        if (state.mode === "random" && state.randomAnswer) {
            state.answer = state.randomAnswer;
            renderLose(state.randomAnswer);
            return;
        }
        fetch(`/api/today?lang=${state.lang}`)
            .then(r => r.json()).then(card => {
                state.answer = card;
                renderLose(card);
            });
    }

    function renderLose(card) {
        const cName = card.card_name || card.local_name || card.name;
        const cImg = card.image_url;
        const cRarity = card.rarity ? tRarity(card.rarity) : "";
        const cType = card.rarity ? tType(card.type) : "";
        const cCost = card.rarity ? (card.display_cost || card.cost) : "";
        const cColor = card.rarity ? tColor(card.color) : "";
        const detail = card.rarity ? `${cRarity} · ${cType} · ${t("refCost")} ${cCost} · ${cColor}` : t("helpDaily");
        const showStreakNext = state.mode === "random";
        const roundStreak = state.roundStreak || 0;
        const bestTime = getBestStreakTime();
        const bestTimeMinutes = Math.floor(bestTime / 60000);
        const bestTimeSeconds = Math.floor((bestTime % 60000) / 1000);
        const bestTimeStr = bestTime > 0 ? (bestTimeMinutes > 0 ? `${bestTimeMinutes}m ${bestTimeSeconds}s` : `${bestTimeSeconds}s`) : "";
        const streakInfo = showStreakNext ? `<p style="font-size:14px;color:var(--text-dim);margin-bottom:8px">🔥 ${t("streakLabel")}: ${roundStreak} · ${t("bestStreak")}: ${getBestStreak()}${bestTimeStr ? ` · ${t("timeSpent")}: ${bestTimeStr}` : ""}</p>` : "";
        const actionBtn = showStreakNext
            ? `<button class="btn-share" id="actionBtn">${t("retryChallenge")}</button>`
            : "";
        result.innerHTML = `
      <p style="font-size:18px;font-weight:700;color:#f87171;margin-bottom:8px">${showStreakNext ? t("lostRandom") : t("lost")}</p>
      ${streakInfo}
      <div id="answerReveal" class="card-reveal" style="display:none">
        ${cImg ? `<img src="${cImg}" alt="${cName}" class="reveal-card-img">` : ""}
        <div class="card-name">${cName}</div>
        <div class="card-detail">${detail}</div>
      </div>
      <div class="result-buttons">
        <button class="btn-share" id="revealBtn">${t("viewAnswer")}</button>
        ${actionBtn}
        <button class="btn-share" onclick="navigator.clipboard.writeText(buildShareText());this.textContent='${t("copy")} ✓'">${t("copy")}</button>
      </div>`;
        document.getElementById("revealBtn").addEventListener("click", () => {
            const el = document.getElementById("answerReveal");
            if (el) el.style.display = "block";
            document.getElementById("revealBtn").style.display = "none";
        });
        const ab = document.getElementById("actionBtn");
        if (ab) ab.addEventListener("click", () => {
            // Retry: keep same card, reset guesses
            _retryRandom();
        });
    }

    function _retryRandom() {
        state.guesses = [];
        state.won = false;
        state.gameOver = false;
        state.currentRow = 0;
        state.startTime = Date.now();
        state.answer = null;
        state.selectedCard = null;
        _updateSelectedDisplay();
        _saveRandomState();
        result.innerHTML = "";
        hint.textContent = "";
        enableInput();
        buildBoard();
        _resetStreak();
    }

    // ---- Card Picker Modal -----------------------------------------------
    let pickerMatches = [];
    let pickerRenderedCount = 0;
    const PICKER_CHUNK = 60;
    let pickerObserver = null;
    let pickerSentinel = null;

    function closePicker() {
        pickerModal.classList.remove("active");
        if (pickerObserver) pickerObserver.disconnect();
    }

    function openPicker() {
        pickerModal.classList.add("active");
        pickerSearch.value = "";
        pickerMatches = state.cards;
        pickerRenderedCount = 0;
        pickerGrid.innerHTML = "";
        pickerCount.textContent = `0 / ${pickerMatches.length}`;
        _renderNextChunk();
        pickerSearch.focus();
    }

    function _renderNextChunk() {
        const start = pickerRenderedCount;
        const end = Math.min(start + PICKER_CHUNK, pickerMatches.length);
        if (start >= end) return;

        for (let i = start; i < end; i++) {
            const card = pickerMatches[i];
            const div = document.createElement("button");
            div.className = "picker-card";
            div.dataset.cardId = card.id;
            div.dataset.idx = i;

            const img = document.createElement("img");
            img.className = "picker-card-img";
            img.loading = "lazy";
            img.alt = card.name;
            img.dataset.src = card.image_url || "";

            const nameSpan = document.createElement("span");
            nameSpan.className = "picker-card-name";
            nameSpan.textContent = card.name;

            const idSpan = document.createElement("span");
            idSpan.className = "picker-card-id";
            idSpan.textContent = card.id;

            div.appendChild(img);
            div.appendChild(nameSpan);
            div.appendChild(idSpan);

            div.addEventListener("click", () => _onPickerCardClick(i));

            pickerGrid.appendChild(div);
        }

        pickerRenderedCount = end;
        pickerCount.textContent = `${pickerMatches.length} / ${state.cards.length}`;
        _observeImages();
        _setupSentinel();
    }

    function _observeImages() {
        const imgs = pickerGrid.querySelectorAll("img[data-src]");
        if (!imgs.length) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute("data-src");
                        img.onerror = function () { this.style.display = "none"; };
                    }
                    obs.unobserve(img);
                }
            });
        }, { root: pickerGrid, rootMargin: "200px" });
        imgs.forEach(img => obs.observe(img));
    }

    function _setupSentinel() {
        if (pickerObserver) pickerObserver.disconnect();
        if (pickerSentinel) pickerSentinel.remove();
        if (pickerRenderedCount >= pickerMatches.length) return;

        pickerSentinel = document.createElement("div");
        pickerSentinel.style.height = "1px";
        pickerGrid.appendChild(pickerSentinel);

        pickerObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                pickerObserver.unobserve(pickerSentinel);
                _renderNextChunk();
            }
        }, { root: pickerGrid, rootMargin: "300px" });
        pickerObserver.observe(pickerSentinel);
    }

    function _onPickerCardClick(idx) {
        const target = pickerGrid.querySelector(`.picker-card[data-idx="${idx}"]`);
        if (!target) return;
        const card = pickerMatches[idx];
        if (!card) return;

        // If already selected → confirm (submit guess)
        if (target.classList.contains("selected")) {
            state.selectedCard = card;
            closePicker();
            makeGuess(card.id);
            return;
        }

        // First click → select (highlight green), keep button text unchanged
        const items = pickerGrid.querySelectorAll(".picker-card");
        items.forEach(el => el.classList.remove("selected"));
        target.classList.add("selected");
        target.scrollIntoView({ block: "nearest" });
        state.selectedCard = card;
    }

    function renderPickerGrid(filter) {
        const f = filter.toLowerCase().trim();
        pickerMatches = state.cards;
        if (f) {
            pickerMatches = pickerMatches.filter(c =>
                c.name.toLowerCase().includes(f) ||
                c.id.toLowerCase().includes(f)
            );
        }
        pickerGrid.innerHTML = "";
        pickerRenderedCount = 0;
        state.selectedCard = null;
        pickerCount.textContent = `0 / ${state.cards.length}`;
        _renderNextChunk();
    }

    function confirmPickerSelection() {
        const items = pickerGrid.querySelectorAll(".picker-card");
        if (items.length === 1 && !state.selectedCard) {
            const card = pickerMatches[0];
            if (card) {
                state.selectedCard = card;
                closePicker();
                makeGuess(card.id);
            }
            return;
        }
        if (state.selectedCard) {
            makeGuess(state.selectedCard.id);
        }
    }

    // ---- Event Handlers --------------------------------------------------
    guessBtn.addEventListener("click", () => {
        if (state.selectedCard) {
            // Card already selected — submit guess
            makeGuess(state.selectedCard.id);
        } else {
            // No card selected — open picker
            openPicker();
        }
    });

    pickerClose.addEventListener("click", closePicker);
    pickerModal.addEventListener("click", (e) => {
        if (e.target === pickerModal) closePicker();
    });

    pickerSearch.addEventListener("input", () => {
        renderPickerGrid(pickerSearch.value);
    });

    pickerSearch.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            confirmPickerSelection();
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const items = pickerGrid.querySelectorAll(".picker-card");
            if (!items.length) return;
            let idx = 0;
            items.forEach((el, i) => { if (el.classList.contains("selected")) idx = i + 1; });
            if (idx >= items.length) idx = items.length - 1;
            _onPickerCardClick(idx);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const items = pickerGrid.querySelectorAll(".picker-card");
            if (!items.length) return;
            let idx = items.length - 1;
            items.forEach((el, i) => { if (el.classList.contains("selected")) idx = i - 1; });
            if (idx < 0) idx = 0;
            _onPickerCardClick(idx);
        } else if (e.key === "Escape") {
            closePicker();
        }
    });

    // ---- Modals ----------------------------------------------------------
    function setupModal(btnId, modalId, closeId) {
        const btn = document.getElementById(btnId);
        const modal = document.getElementById(modalId);
        const close = document.getElementById(closeId);
        if (!btn || !modal || !close) return;
        btn.addEventListener("click", () => modal.classList.add("active"));
        close.addEventListener("click", () => modal.classList.remove("active"));
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.classList.remove("active");
        });
    }

    setupModal("helpBtn", "helpModal", "helpClose");
    setupModal("langBtn", "langModal", "langClose");
    setupModal("themeBtn", "themeModal", "themeClose");
    setupModal("refBtn", "refModal", "refClose");
    // History modal: opened by mode-btn[data-mode=past], just wire close
    {
        const modal = document.getElementById("historyModal");
        const close = document.getElementById("historyClose");
        if (modal && close) {
            close.addEventListener("click", () => modal.classList.remove("active"));
            modal.addEventListener("click", (e) => {
                if (e.target === modal) modal.classList.remove("active");
            });
        }
    }

    // Build translation reference table
    document.getElementById("refBtn").addEventListener("click", buildRefTable);

    function buildRefTable() {
        const c = document.getElementById("refContent");
        const curLang = state.lang;

        // Only show real card color keys, not internal character entries
        const validColors = ["ironclad", "silent", "defect", "necrobinder", "regent", "colorless", "curse", "status", "event", "quest", "token"];

        fetch("/api/localization?lang=eng").then(r => r.json()).then(engData => {
            let html = "";
            // Order matches the 6 attribute columns: Rarity → Type → Cost → Color → Keywords
            const sections = [
                {
                    titleKey: "refRarity",
                    map1: engData.rarity,
                    map2: locData.rarity,
                    filter: (k) => ["BASIC", "COMMON", "UNCOMMON", "RARE", "ANCIENT", "CURSE", "STATUS", "EVENT", "QUEST", "TOKEN", "SPECIAL"].includes(k)
                },
                {
                    titleKey: "refType",
                    map1: engData.type,
                    map2: locData.type,
                    filter: (k) => ["ATTACK", "SKILL", "POWER", "CURSE", "STATUS", "QUEST"].includes(k)
                },
                {
                    titleKey: "refCost",
                    map1: null,
                    map2: null,
                    isCost: true,
                },
                {
                    titleKey: "refColor",
                    map1: engData.color,
                    map2: locData.color,
                    filter: (k) => validColors.includes(k)
                },
                {
                    titleKey: "refKeywords",
                    map1: engData.keywords,
                    map2: locData.keywords,
                    filter: (k) => true
                },
            ];
            for (const sec of sections) {
                html += `<h3 class="ref-section-title">${t(sec.titleKey)}</h3>`;
                if (sec.isCost) {
                    // Cost reference — all possible cost display values
                    html += `<table class="ref-table"><tr><th>Display</th><th>${t("refCost")} Type</th></tr>`;
                    const costRows = [
                        { d: "0", t: t("cost0") },
                        { d: "1", t: t("cost1") },
                        { d: "2", t: t("cost2") },
                        { d: "3", t: t("cost3") },
                        { d: "X", t: t("costX") },
                        { d: "a / b", t: t("costStar") },
                        { d: "a / X", t: t("costStarVar") },
                        { d: "?", t: t("costUnplay") },
                    ];
                    for (const row of costRows) {
                        html += `<tr><td class="ref-key">${row.d}</td><td>${row.t}</td></tr>`;
                    }
                    html += `</table>`;
                } else {
                    html += `<table class="ref-table"><tr><th>Key</th><th>English</th><th>${curLang.toUpperCase()}</th></tr>`;
                    const keys = Object.keys(sec.map1).sort().filter(sec.filter || (() => true));
                    for (const k of keys) {
                        const v1 = sec.map1[k];
                        const v2 = sec.map2[k] || "—";
                        html += `<tr><td class="ref-key">${k}</td><td>${v1}</td><td>${v2}</td></tr>`;
                    }
                    html += `</table>`;
                }
            }

            c.innerHTML = html;
        }).catch(() => {
            c.innerHTML = '<p style="color:var(--text-dim);text-align:center;">Failed to load reference data.</p>';
        });
    }

    // ---- Past Challenges -------------------------------------------------
    function buildHistoryList() {
        const list = document.getElementById("historyList");
        list.innerHTML = '<p style="color:var(--text-dim);text-align:center;">Loading...</p>';

        // Apply translations
        byId("historyTitle", el => el.textContent = t("historyTitle"));

        fetch(`/api/daily/dates?lang=${state.lang}`)
            .then(r => r.json())
            .then(dates => {
                if (!dates.length) {
                    list.innerHTML = '<p style="color:var(--text-dim);text-align:center;">No past challenges yet.</p>';
                    return;
                }
                // Load user's completion data from localStorage
                let localHistory = {};
                try {
                    const raw = localStorage.getItem("spiredle-history");
                    if (raw) localHistory = JSON.parse(raw);
                } catch { }

                let html = "";
                for (const d of dates) {
                    const entry = localHistory[d.date];
                    const completed = entry && entry.won;
                    const badgeHtml = completed ? `<span class="history-badge history-badge-pass">✓</span>` : "";
                    html += `<div class="history-item" data-date="${d.date}" data-completed="${completed ? "1" : "0"}">
                        <span class="history-date" title="${t("modeDaily")} ${d.date}">${d.date}</span>
                        <span class="history-answer">${completed ? `<span class="answer-mask blurred"></span>` : ""}</span>
                        <span class="history-status">${badgeHtml}</span>
                    </div>`;
                }
                list.innerHTML = html;

                // Attach reusable card data cache
                window._pastCardCache = window._pastCardCache || {};

                // Click handlers: date → play; answer mask → reveal card
                list.querySelectorAll(".history-item").forEach(el => {
                    const date = el.dataset.date;
                    const completed = el.dataset.completed === "1";

                    // Date column → play challenge
                    const dateSpan = el.querySelector(".history-date");
                    if (dateSpan) {
                        dateSpan.addEventListener("click", (e) => {
                            e.stopPropagation();
                            playPastChallenge(date);
                        });
                    }

                    // Answer mask → reveal card (completed only)
                    if (completed) {
                        const mask = el.querySelector(".answer-mask");
                        if (mask) {
                            mask.addEventListener("click", (e) => {
                                e.stopPropagation();
                                showPastAnswerInList(el, date);
                            });
                        }
                    }
                });
            })
            .catch(() => {
                list.innerHTML = '<p style="color:var(--text-dim);text-align:center;">Failed to load history.</p>';
            });
    }

    function showPastAnswerInList(itemEl, date) {
        fetch(`/api/daily/${date}?lang=${state.lang}`)
            .then(r => r.json())
            .then(card => {
                if (card.error) return;
                const cName = card.local_name || card.name;
                const cId = card.id;
                // Replace the answer column with revealed card info
                const answerCol = itemEl.querySelector(".history-answer");
                if (answerCol) {
                    answerCol.innerHTML = `<div class="answer-revealed"><span class="answer-id">${cId}</span><span class="answer-name">${cName}</span></div>`;
                }
            })
            .catch(() => { });
    }

    // ---- Past Challenge Replay (local storage, no server guess records) --
    const LS_HISTORY = "spiredle-history";

    function _getHistory() {
        try { return JSON.parse(localStorage.getItem(LS_HISTORY) || "{}"); } catch { return {}; }
    }
    function _saveHistoryEntry(date, data) {
        const h = _getHistory();
        h[date] = data;
        localStorage.setItem(LS_HISTORY, JSON.stringify(h));
    }

    async function playPastChallenge(date) {
        // Save current mode before switching
        const prevMode = state.mode;

        // Close history modal
        document.getElementById("historyModal").classList.remove("active");

        // Fetch the card for this date
        try {
            const res = await fetch(`/api/daily/${date}?lang=${state.lang}`);
            const card = await res.json();
            if (card.error) {
                hint.textContent = card.error;
                return;
            }

            // Set up state for past challenge replay (local mode)
            state.mode = "past";
            _updateModeUI();
            state.date = date;
            state.randomAnswer = card;  // reuse randomAnswer field
            state.guesses = [];
            state.won = false;
            state.gameOver = false;
            state.currentRow = 0;
            state.answer = null;
            state.startTime = Date.now();
            state.selectedCard = null;
            _updateSelectedDisplay();

            dateDisplay.textContent = date;
            result.innerHTML = "";
            hint.textContent = "";

            await loadCards();
            buildBoard();
            enableInput();
        } catch (err) {
            console.error("Failed to load past challenge:", err);
            hint.textContent = "Failed to load challenge.";
        }
    }

    // ---- View Past Challenge Answer --------------------------------------
    async function viewPastAnswer(date) {
        document.getElementById("historyModal").classList.remove("active");
        try {
            const res = await fetch(`/api/daily/${date}?lang=${state.lang}`);
            const card = await res.json();
            if (card.error) return;
            const cName = card.local_name || card.name;
            const cImg = card.image_url;
            const cRarity = tRarity(card.rarity);
            const cType = tType(card.type);
            const cCost = card.display_cost || card.cost;
            const cColor = tColor(card.color);
            // Show answer in result area
            state.mode = "past";
            _updateModeUI();
            state.date = date;
            state.randomAnswer = card;
            state.answer = card;
            state.guesses = [];
            state.won = true;
            state.gameOver = true;
            state.currentRow = 0;
            state.selectedCard = null;
            _updateSelectedDisplay();
            dateDisplay.textContent = date;
            await loadCards();
            buildBoard();
            disableInput();
            showWin();
        } catch (err) {
            console.error("Failed to view answer:", err);
        }
    }

    document.querySelectorAll(".lang-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const lang = btn.dataset.lang;
            window.location.href = `/?lang=${lang}`;
        });
    });

    // ---- Start -----------------------------------------------------------
    document.addEventListener("DOMContentLoaded", () => init("daily"));
})();
