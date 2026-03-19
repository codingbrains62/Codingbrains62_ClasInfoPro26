<template>
    <Card class="card">
        <template #content>
            <a :href="link" :target="external ? '_blank' : '_self'" class="img-link">
                <div class="img-wrapper">
                    <img :src="img" alt="card" />
                </div>
            </a>
 
            <div class="text-wrapper">
                <p class="description">{{ description }}</p>
                <a :href="link" :target="external ? '_blank' : '_self'" class="action-link">
                    {{ title }}
                </a>
            </div>
        </template>
    </Card>
</template>
 
<script setup>
import Card from 'primevue/card'
 
defineProps({
    title: String,
    description: String,
    img: String,
    link: String,
    external: Boolean
})
</script>
 
<style scoped>
.card {
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.25s ease;
}
 
.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}
 
.img-wrapper {
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0b5ea8;
}
 
.img-wrapper img {
    max-height: 80px;
    object-fit: contain;
}
 
.text-wrapper {
    padding: 18px 16px 20px;
}
 
.description {
    font-size: 14px;
    line-height: 1.6;
    color: #444;
    margin-bottom: 16px;
}
 
.action-link {
    color: #0b5ea8;
    font-weight: 600;
    text-decoration: none;
}
 
.action-link:hover {
    text-decoration: underline;
}
</style>
 