<script setup>
    import { onMounted, ref, watch, computed } from "vue";

    const todos = ref([])

    const name = ref('')

    const formValidationMsg = ref('')

    const input_content = ref('')

    const input_category = ref(null)

    const todos_asc = computed(() => todos.value.sort((a, b) => {
        return a.createdAt - b.createdAt
    }))

    const validateTodo = () => {
        if (input_content.value.trim() === '')
        {
            formValidationMsg.value = "文字を入力してください"
            return false
        }

        if (input_category.value === null)
        {
            formValidationMsg.value = "カテゴリを選択してください"
            return false
        }

        return true

    }

    const addTodo = () => {

        const valiFlg = validateTodo()

        if (!valiFlg) {
            throw "aaaa"
        }

        todos.value.push({
            content: input_content.value,
            category: input_category.value,
            done: false,
            createdAt: new Date().getTime()
        })

        formValidationMsg.value = ""


        // console.log(todos.value)

    }

    const removeTodo = (todo) => {
        todos.value = todos.value.filter(t => t !== todo)
    }

    watch(todos, (newVal) => {
        localStorage.setItem('todos', JSON.stringify(newVal))
        // localStorage.setItem('todos', newVal)
    }, { deep: true })

    watch(name, (newVal) => {
        localStorage.setItem('name', newVal)
    })

    watch(input_content, () => {
        if (input_content.value.length <= 4)
        {
            formValidationMsg.value = "4文字を以上入力してください"
        } else {
            formValidationMsg.value = ""

        }
    })

    onMounted(() => {
        name.value = localStorage.getItem('name') || ''
        // name.value = localStorage.getItem('name')
        // compare above tow lines

        todos.value = JSON.parse(localStorage.getItem('todos')) || []
        // todos.value = localStorage.getItem('todos') || []
        console.log(todos.value)
    })
</script>

<template>

    <main class="app">
        <section class="greeting">
        <h2 class="title">
            What's up <input type="text" placeholder="Name here" v-model="name">
        </h2>
        </section>

        <section class="create-todo">
            <h3>Create a todo</h3>

            <form @submit.prevent="addTodo">
                <h4>What's on your todo ?</h4>
                <input 
                    type="text" 
                    placeholder="e.g make a video"
                    v-model="input_content">

                    <!-- {{ input_content}} -->

                <h4>Pick a category</h4>

                <div class="option">

                    <label>
                    <input 
                        type="radio"
                        name="category"
                        value="business"
                        v-model="input_category" />
                    
                    <span class="bubble business"></span>
                    <div>Business</div>
                    </label>

                    <label>
                    <input 
                        type="radio"
                        name="category"
                        value="personal"
                        v-model="input_category" />
                    
                    <span class="bubble personal"></span>
                    <div class="text-red-900">Personal</div>
                    </label>
                </div>
                <input type="submit" value="Add todo" />
            </form> 
            <p style="color:red">
                {{  formValidationMsg }}
            </p>
        </section>

        <section class="todo-list">
            <h3>TODO LIST</h3>
            <div class="list">
                <div v-for="todo in todos_asc" :class="`todo-item ${todo.done && 'done'}`">
                    <label>
                        <input type="checkbox" v-model="todo.done">    
                        <span :class="`bubble ${todo.category}`"></span>
                    </label>

                    <div class="todo-content">
                        <input type="text" v-model="todo.content" />
                    </div>    
                    <div class="action">
                        <button @click="removeTodo(todo)">Delete</button>
                    </div>
                </div>
            </div>
        </section>

        <router-view name="Typing"></router-view>
    </main>
</template>