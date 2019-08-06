import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                tabarr: true,
            },
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/classificationPage",
            name: "classificationPage",
            component: () => import("./views/classificationPage.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/Me",
            name: "Me",
            component: () => import("./views/Me.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/GoodsDetails",
            name: "GoodsDetails",
            component: () => import("./views/GoodsDetails.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/SearchPage",
            name: "SearchPage",
            component: () => import("./views/SearchPage.vue"),
            children: [
                {
                    path: "/SearchPage",
                    name: "SearchCon",
                    component: () => import("./views/SearchCon.vue"),
                    meta: {
                        tabarr: true,
                    },
                },
                {
                    path: "/SearchPage/SearchCon",
                    name: "SearchCon",
                    component: () => import("./views/SearchCon.vue"),
                    meta: {
                        tabarr: true,
                    },
                },
                {
                    path: "/SearchPage/CategoryList",
                    name: "CategoryList",
                    component: () => import("./views/CategoryList.vue"),
                    meta: {
                        tabarr: true,
                    },
                },


            ]
        },

        {
            path: "/FootprintPage",
            name: "FootprintPage",
            component: () => import("./views/FootprintPage.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/ConsultingPage",
            name: "ConsultingPage",
            component: () => import("./views/ConsultingPage.vue"),
            meta: {
                tabarr: true,
            },
        },

        {
            path: "/XuZhi",
            name: "XuZhi",
            component: () => import("./views/XuZhi.vue"),
            meta: {
                tabarr: true,
            },
        },

        {
            path: "/BaoGao",
            name: "BaoGao",
            component: () => import("./views/BaoGao.vue"),
            meta: {
                tabarr: false,
            },
        },
        {
            path: "/AnswerPage",
            name: "AnswerPage",
            component: () => import("./views/AnswerPage.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/QuestionTitle",
            name: "QuestionTitle",
            component: () => import("./views/QuestionTitle.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/CheckedSex",
            name: "CheckedSex",
            component: () => import("./views/CheckedSex.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/PingJia",
            name: "PingJia",
            component: () => import("./views/PingJia.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/EvaluationPage",
            name: "EvaluationPage",
            component: () => import("./views/EvaluationPage.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/ThankEvaluation",
            name: "ThankEvaluation",
            component: () => import("./views/ThankEvaluation.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/MyCanvars",
            name: "MyCanvars",
            component: () => import("./views/MyCanvars.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/ToPromote",
            name: "ToPromote",
            component: () => import("./views/ToPromote.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/PromotionRules",
            name: "PromotionRules",
            component: () => import("./views/PromotionRules.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/Withdrawal",
            name: "Withdrawal",
            component: () => import("./views/Withdrawal.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/AccountDetails",
            name: "AccountDetails",
            component: () => import("./views/AccountDetails.vue"),
            meta: {
                tabarr: false,
            },
        },
        {
            path: "/SaysPromoter",
            name: "SaysPromoter",
            component: () => import("./views/SaysPromoter.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/Audit",
            name: "Audit",
            component: () => import("./views/Audit.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/MyCanvas",
            name: "MyCanvas",
            component: () => import("./views/MyCanvas.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/shareCanvas",
            name: "shareCanvas",
            component: () => import("./views/shareCanvas.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/AcceptInvitation",
            name: "AcceptInvitation",
            component: () => import("./views/AcceptInvitation.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/Customer",
            name: "Customer",
            component: () => import("./views/Customer.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/ExtensionWorkers",
            name: "ExtensionWorkers",
            component: () => import("./views/ExtensionWorkers.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/PromoteOrder",
            name: "PromoteOrder",
            component: () => import("./views/PromoteOrder.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/Feedback",
            name: "Feedback",
            component: () => import("./views/Feedback.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/FillFeedback",
            name: "FillFeedback",
            component: () => import("./views/FillFeedback.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/successBack",
            name: "successBack",
            component: () => import("./views/successBack.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/auth",
            name: "auth",
            component: () => import("./views/auth.vue"),
            meta: {
                tabarr: false,
            },
        },
        {
            path: "/mygift",
            name: "mygift",
            component: () => import("./views/Mygift.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/share",
            name: "share",
            component: () => import("./views/share.vue"),
            meta: {
                tabarr: true,
            },
        },
        {
            path: "/okbuy",
            name: "okbuy",
            component: () => import("./views/okbuy.vue"),
            meta: {
                tabarr: false,
            },
        },
        {
            path: "/Mydetails",
            name: "Mydetails",
            component: () => import("./views/Mydetails.vue"),
            meta: {
                tabarr: false,
            },
        },
        {
            path: "/BaoGaoCanvas",
            name: "BaoGaoCanvas",
            component: () => import("./views/BaoGaoCanvas.vue"),
            meta: {
                tabarr: false,
            },
        },
    ]
})
