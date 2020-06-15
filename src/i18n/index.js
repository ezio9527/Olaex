import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

//const messages = {};

const i18n = new VueI18n({
	locale:sessionStorage.getItem('language') || 'en',
	messages :{ /**必须为 messages*/
		'zh':require('@/i18n/language/i18n_zh'),
		'en':require('@/i18n/language/i18n_en'),
		'jp':require('@/i18n/language/i18n_jp')
	}
})


export default i18n