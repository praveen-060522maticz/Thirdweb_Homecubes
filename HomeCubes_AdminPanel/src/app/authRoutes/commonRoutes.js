import { lazy } from "react";



const Routes = [
    {
        path: "/",
        component: lazy(() => import('../loginpages/Login.js')),
        name: '/'
    },
    {
        path: "/login/admin",
        component: lazy(() => import('../loginpages/Login.js')),

    },
    {
        path: "/editarticle",
        component: lazy(() => import('../article/editarticle.js')),
        name: '/admin'
    },
    {
        path: "/article",
        component: lazy(() => import('../article/article.js')),
        name: '/admin'
    },
    {
        path: "/addarticle",
        component: lazy(() => import('../article/addarticle.js')),
        name: '/admin'
    },
    //aboutus
    {
        path: "/aboutuser",
        component: lazy(() => import('../Aboutusers/aboutuserlist.js')),
        name: '/admin'
    },
    {
        path: "/addaboutuser",
        component: lazy(() => import('../Aboutusers/addaboutuser')),
        name: '/admin'
    },
    {
        path: "/aboutusteps/:projectId",
        component: lazy(() => import('../Aboutusers/aboutusteps.js')),
        name: '/admin'
    },
    {
        path: "/editaboutuser",
        component: lazy(() => import('../Aboutusers/editaboutuser')),
        name: '/admin'
    },
    {
        path: "/aboutEdit",
        component: lazy(() => import('../Aboutusers/addaboutuser.js')),
        name: '/admin'
    },
    {
        path: "/aboutList",
        component: lazy(() => import('../Aboutusers/addaboutuser.js')),
        name: '/admin'
    },
    {
        path: "/aboutusteps.js",
        component: lazy(() => import('../Aboutusers/aboutusteps.js')),
        name: '/admin'
    },
    {
        path: "/aboutList/:projectId",
        component: lazy(() => import('../Aboutusers/aboutusteps.js')),
        name: '/admin'
    },
    {
        path: "/aboutaddsteps",
        component: lazy(() => import('../Aboutusers/aboutaddsteps.js')),
        name: '/admin'
    },
    {
        path: "/editaddsteps",
        component: lazy(() => import('../Aboutusers/aboutaddsteps.js')),
        name: '/admin'
    },
    //investment

    {
        path: "/investmentList/:projectId",
        component: lazy(() => import('../Aboutusers/investmentList.js')),
        name: '/admin'
    },
    {
        path: "/investmentadd",
        component: lazy(() => import('../Aboutusers/investmentadd.js')),
        name: '/admin'
    },
    {
        path: "/InvestmentEdit",
        component: lazy(() => import('../Investment/addinvestment.js')),
        name: '/admin'
    },
    {
        path: "/dashboard",
        component: lazy(() => import('../dashboard/Dashboard.js')),
        name: '/admin'
    },
    // {
    //     path: "/nftdetails",
    //     component: lazy(() => import('../nftlist/nftList.js')),
    //     name: '/admin'
    // },
    {
        path: "/nftlist",
        component: lazy(() => import('../nftlist/nftList.js')),
        name: '/admin'
    },
    {
        path: "/addNfts",
        component: lazy(() => import('../nftlist/Addnfts.js')),
        name: '/admin'
    },
    {
        path: "/editNfts",
        component: lazy(() => import('../nftlist/Addnfts.js')),
        name: '/admin'
    },
    {
        path: "/markettokens",
        component: lazy(() => import('../nftlist/marketTokens.js')),
        name: '/admin'
    },
    {
        path: "/tokendetail",
        component: lazy(() => import('../nftlist/marketTokens.js')),
        name: '/admin'
    },
    {
        path: "/addcategory",
        component: lazy(() => import('../category/addcategory.js')),
        name: '/admin'
    },
    {
        path: "/editcategory",
        component: lazy(() => import('../category/addcategory.js')),
        name: '/admin'
    },
    {
        path: "/categorylist",
        component: lazy(() => import('../category/categorylist.js')),
        name: '/admin'
    },
    {
        path: "/currencylist",
        component: lazy(() => import('../currencyList/currencylist.js')),
        name: '/admin'
    },
    {
        path: "/addtoken",
        component: lazy(() => import('../currencyList/addtoken.js')),
        name: '/admin'
    },
    {
        path: "/editcms",
        component: lazy(() => import('../cmscontent/cmslist.js')),
        name: '/admin'
    },
    {
        path: "/cmshomelist",
        component: lazy(() => import('../cmsAndFaq/cmshomelist.js')),
        name: '/admin'
    },
    {
        path: "/editcmshome",
        component: lazy(() => import('../cmsAndFaq/editcmshome.js')),
        name: '/admin'
    },
    {
        path: "/cmsandfaq",
        component: lazy(() => import('../cmsAndFaq/cmsbox.js')),
        name: '/admin'
    },
    {
        path: "/addcmshome",
        component: lazy(() => import('../cmsAndFaq/addcmshome.js')),
        name: '/admin'
    },
    {
        path: "/addusers",
        component: lazy(() => import('../subscribers/addusers.js')),
        name: '/admin'
    },
    {
        path: "/subscriberslist",
        component: lazy(() => import('../subscribers/subscriberlist.js')),
        name: '/admin'
    },
    {
        path: "/sendmail",
        component: lazy(() => import('../subscribers/sendmail.js')),
        name: '/admin'
    },
    {
        path: "/sociallist",
        component: lazy(() => import('../sociallinks/socaillinks.js')),
        name: '/admin'
    },
    {
        path: "/addsocial",
        component: lazy(() => import('../sociallinks/addsocial.js')),
        name: '/admin'
    },
    {
        path: "/editsociallink",
        component: lazy(() => import('../sociallinks/socaillinks.js')),
        name: '/admin'
    },
    {
        path: "/servicefee",
        component: lazy(() => import('../serviceFeeManagement/listservicefee.js')),
        name: '/admin'
    },


    // {
    //     path: "/userlist",
    //     component: lazy(() => import('../userlist/userlist.js')),
    //     name: '/admin'
    // },
    {
        path: "/userlist",
        component: lazy(() => import('../user/userlist')),
        name: '/admin'
    },
    {
        path: "/userdetail",
        component: lazy(() => import('../user/userlist')),
        name: '/admin'
    },
    {
        path: "/tokenlist",
        component: lazy(() => import('../token/tokenlist')),
        name: '/admin'
    },
    {
        path: "/viewdetail",
        component: lazy(() => import('../token/tokenlist')),
        name: '/admin'
    },
    {
        path: "/faqlist",
        component: lazy(() => import('../faqlist/faqlist.js')),
        name: '/admin'
    },
    {
        path: "/addfaq",
        component: lazy(() => import('../faqlist/addfaq.js')),
        name: '/admin'
    },
    {
        path: "/addfaqcontent",
        component: lazy(() => import('../faqlist/addfaqcontent')),
        name: '/admin'
    },
    {
        path: "/editfaq",
        component: lazy(() => import('../faqlist/faqlist.js')),
        name: '/admin'
    },
    {
        path: "/editfaqcontent",
        component: lazy(() => import('../faqlist/editfaqcontent'))
    },
    {
        path: "/burnlist",
        component: lazy(() => import('../burnlist/burntokenlist.js')),
        name: '/admin'
    },
    {
        path: "/reportlist",
        component: lazy(() => import('../report/reportlist.js')),
        name: '/admin'
    },
    {
        path: "/viewreporttoken",
        component: lazy(() => import('../report/reportlist.js')),
        name: '/admin'
    },
    {
        path: "/nfttaglist",
        component: lazy(() => import('../nfttag/nfttaglist.js')),
        name: '/admin'
    },
    {
        path: "/editnfttag",
        component: lazy(() => import('../nfttag/nfttaglist.js')),
        name: '/admin'
    },
    {
        path: "/artist-list",
        component: lazy(() => import('../Artist/Artist')),
        name: '/admin'
    },
    {
        path: "/artist-save",
        component: lazy(() => import('../Artist/Artist')),
        name: '/admin'
    },
    {
        path: "/emailtemplatelist",
        component: lazy(() => import('../emailtemplates/emailtemplatelist')),
        name: '/admin'
    },
    {
        path: "/emailtemplateedit/:slug",
        component: lazy(() => import('../emailtemplates/emailtemplatelist')),
        name: '/admin'
    },
    {
        path: "/npo-list",
        component: lazy(() => import('../NPO/NPO')),
        name: '/admin'
    },
    {
        path: "/npo-save",
        component: lazy(() => import('../NPO/NPO')),
        name: '/admin'
    }, {
        path: "/promo-drops",
        component: lazy(() => import('../PROMO/PROMODROPS')),
        name: '/admin'
    },
    {
        path: "/promo/:CollectionUrl",
        component: lazy(() => import('../PROMO/GENERATEPROMO')),
        name: '/admin'
    },
    {
        path: "/promo-code/:CollectionUrl/:TokenId",
        component: lazy(() => import('../PROMO/VIEWPROMO')),
        name: '/admin'
    },
    // {
    //     path: "/search/:key",
    //     component: lazy(()=>import('../')),
    //     name: '/public'
    // },
    {
        path: "/promotionlist",
        component: lazy(() => import('../promotion/tokenlist')),
        name: '/admin'
    },
    {
        path: "/projectList",
        component: lazy(() => import('../Projects/ListProject.js')),
        name: '/admin'
    },
    {
        path: "/projectView",
        component: lazy(() => import('../Projects/AddProject.js')),
        name: '/admin'
    },
    {
        path: "/projectAdd",
        component: lazy(() => import('../Projects/AddProject.js')),
        name: '/admin'
    },
    {
        path: "/ProjectCmsList",
        component: lazy(() => import('../Projects/ProjectCmsList.js')),
        name: '/admin'
    },
    {
        path: "/ProjectCmsAdd",
        component: lazy(() => import('../Projects/ProjectCmsAdd.js')),
        name: '/admin'
    },
    {
        path: "/ProjectCmsEdit",
        component: lazy(() => import('../Projects/ProjectCmsAdd.js')),
        name: '/admin'
    },
    {
        path: "/projectEdit",
        component: lazy(() => import('../Projects/AddProject.js')),
        name: '/admin'
    },
    {
        path: "/GalleryList",
        component: lazy(() => import('../Gallery/galleryList.js')),
        name: '/admin'
    },
    {
        path: "/GalleryFiles",
        component: lazy(() => import('../Gallery/galleryImages.js')),
        name: '/admin'
    },
    {
        path: "/GalleryAdd",
        component: lazy(() => import('../Gallery/AddGallery.js')),
        name: '/admin'
    },
    {
        path: "/GalleryEdit",
        component: lazy(() => import('../Gallery/AddGallery.js')),
        name: '/admin'
    },
    {
        path: "/KycList",
        component: lazy(() => import('../KYC/KycList.js')),
        name: '/admin'
    },
    {
        path: "/feedList",
        component: lazy(() => import('../newsFeed/feedList.js')),
        name: '/admin'
    },
    {
        path: "/feeds",
        component: lazy(() => import('../newsFeed/feeds.js')),
        name: '/admin'
    },
    {
        path: "/feedsAdd",
        component: lazy(() => import('../newsFeed/feedAdd.js')),
        name: '/admin'
    },
    {
        path: "/feedsEdit",
        component: lazy(() => import('../newsFeed/feedAdd.js')),
        name: '/admin'
    },
    {
        path: "/stepList/:projectId",
        component: lazy(() => import('../Projects/steps.js')),
        name: '/admin'
    },
    {
        path: "/addSteps",
        component: lazy(() => import('../Projects/addSteps.js')),
        name: '/admin'
    },
    {
        path: "/editSteps",
        component: lazy(() => import('../Projects/addSteps.js')),
        name: '/admin'
    },
    // {
    //     path: "/faqlist",
    //     component: lazy(() => import('../faqlist/faqlist.js')),
    //     name: '/admin'
    // },

    {
        path: "/listcontactus",
        component: lazy(() => import('../contactus/listcontactus.js')),
        name: '/admin'
    },

    {
        path: "/blogCategoryAdd",
        component: lazy(() => import('../BlogsCategory/blogCategoryAdd.js')),
        name: '/admin'
    },
    {
        path: "/blogCategoryEdit",
        component: lazy(() => import('../BlogsCategory/blogCategoryAdd.js')),
        name: '/admin'
    },
    {
        path: "/blogCategoryList",
        component: lazy(() => import('../BlogsCategory/blogCategoryList.js')),
        name: '/admin'
    },
    {
        path: "/blogAdd",
        component: lazy(() => import('../Blogs/blogsAdd.js')),
        name: '/admin'
    },
    {
        path: "/blogEdit",
        component: lazy(() => import('../Blogs/blogsAdd.js')),
        name: '/admin'
    },
    {
        path: "/blogList",
        component: lazy(() => import('../Blogs/blogsList.js')),
        name: '/admin'
    },
    {
        path: "/blogView",
        component: lazy(() => import('../Blogs/blogsAdd.js')),
        name: '/admin'
    },
    {
        path: "/stackProjects",
        component: lazy(() => import('../staking/stackProjects.js')),
        name: '/admin'
    },
    {
        path: "/rewardProjects",
        component: lazy(() => import('../staking/stackProjects.js')),
        name: '/admin'
    },
    {
        path: "/projectRewards",
        component: lazy(() => import('../staking/stackProjects.js')),
        name: '/admin'
    },
    {
        path: "/mintReport",
        component: lazy(() => import('../staking/stackProjects.js')),
        name: '/admin'
    },
    {
        path: "/marketPlaceReport",
        component: lazy(() => import('../staking/stackProjects.js')),
        name: '/admin'
    },
    {
        path: "/royaltyReport",
        component: lazy(() => import('../staking/stackProjects.js')),
        name: '/admin'
    },
    {
        path: "/StakingDetails",
        component: lazy(() => import('../staking/stakingDetails.js')),
        name: '/admin'
    },
    {
        path: "/rewardHistory",
        component: lazy(() => import('../staking/rewardHistory.js')),
        name: '/admin'
    },
    {
        path: "/StakingReward",
        component: lazy(() => import('../staking/stakeReward.js')),
        name: '/admin'
    },
    //whitelist
    {
        path: "/addwhitelist",
        component: lazy(() => import('../whitelists/addwhitelist.js')),
        name: '/admin'
    },
    {
        path: "/whitelists",
        component: lazy(() => import('../whitelists/listwhitelist.js')),
        name: '/admin'
    },
    {
        path: "/selectwhitelist/:_id",
        component: lazy(() => import('../whitelists/selectwhitelist.js')),
        name: '/admin'
    },
    {
        path: "/adminList",
        component: lazy(() => import('../Admin/adminList.js')),
        name: '/admin'
    },
    {
        path: "/addAdmin",
        component: lazy(() => import('../Admin/addAdmin.js')),
        name: '/admin'
    },
    {
        path: "/mintList",
        component: lazy(() => import('../Reports/MintReport.js')),
        name: '/admin'
    },
    {
        path: "/activityList",
        component: lazy(() => import('../Reports/ActivityReport.js')),
        name: '/admin'
    },
    {
        path: "/royaltyList",
        component: lazy(() => import('../Reports/RoyaltyReport.js')),
        name: '/admin'
    },
]


export default Routes;
