<script setup>
import { onMounted, ref, watch, computed } from 'vue';

    const word = ref('')

    // 赤文字として表示されるタイピングに成功した英文字
    const pressed_word = ref('')

    const words = []
    const timeLimit = ref(3000)

    // タイピングに成功したワードの数
    const resultCnt = ref(0)

    const finishFlg = ref(false)

    // ゲーム開始前のDOMを表示
    const startFlg = ref(true)

    let random_int

    const missNumber = ref(0)

    const leftWords = computed(() => {
        return 3 - words.length
    })

    const startGame = () => {
        startFlg.value = false

        // ゲーム開始時に1秒カウントダウンして、それ以降はwatchでカウントダウンする
        timeLimit.value = timeLimit.value - 100
    }

    const retrievePokemons = async () => {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=3', {
            method: 'GET'
        })
        const dataArrays = await response.json()

        const pokemons = dataArrays.results

        pokemons.forEach(pokemon => {
            words.push(pokemon.name)
        });
        setWord()
    }


    // ゲーム開始時とワードをうちおえたら新規でワードを表示する
    const setWord = () => {
        random_int = Math.floor(Math.random() * words.length)
        // console.log(random_int)
        // console.log(words)
        word.value = words[random_int]
    }


    // キーをおしたら
    const keyDown = () => {

        addEventListener('keydown', (e) => {


            // ゲーム開始前もしくは終了後のkeydownを無効化
            if (startFlg.value || finishFlg.value)
            {
                return
            }

            // まちがったキーをおしたら
            if (e.key !== word.value[0])
            {
                missNumber.value++
                return
            }

            // 正しくタイピングした英文字を赤色で表示
            pressed_word.value = pressed_word.value.concat(e.key)

            // 出題されたワードの先頭文字を削除
            word.value = word.value.slice(1)

            // 表示されたワードを最後まで打ち終えたら
            if (word.value.length === 0)
            {
                pressed_word.value = ''
                words.splice(random_int, 1)
                console.log(words)

                resultCnt.value++

                setWord()

                // 制限時間内にすべてのタイピングキーワードをうちおえたら
                if(words.length === 0){
                    finishFlg.value = true

                    return;
                }
            }
        })
    }


    const restartGame = () => {
        timeLimit.value = 3000

    }

    watch(timeLimit, () => {
        if (timeLimit.value > 0)
        {
            setTimeout(()=> {
                timeLimit.value--
            })
        } else if (timeLimit.value === 0)
        {
            finishFlg.value = true
        }
    })


    onMounted(() => {

        // ゲーム開始前に予めポケモンを取得しておく。
        retrievePokemons()
        keyDown()
    })

</script>

<template>
    <div class="typing-game">

    <div style="margin: 0 auto; width: 150px" v-show="startFlg">
        <button style="padding: 10px; background-color: red;" @click="startGame()">ゲームを開始する</button>
    </div>


    <div v-show="!startFlg && !finishFlg">
        <h2 class="typing">TYPING GAME</h2>
        <p>Please type the characters displayed.<br/>正しい文字をタイピングすると文字の色が変わります。<br/></p>
        <p class="typing"><span>{{pressed_word}}</span>{{word}}</p>
        <p>Miss Counter::{{missNumber}}</p> 
        <p>残り時間：{{timeLimit}}</p>   
        <p>残りの問題数：{{ leftWords }}</p> 
        
        
    </div>

    <div v-show="finishFlg">
        <p>結果{{ resultCnt }}</p>
        <button @click="restartGame()">もう一度ゲームをする</button>
        ゲーム終了
    </div>
    </div>
</template>

<style scoped>
    h2{
        text-align: center;
        font-size: 20px;
    }
    body {
        text-align: center;
    }
    .typing{
        font-size: 30px;
        font-weight: bold;
    }
    span{
        color:red;
    }
</style>