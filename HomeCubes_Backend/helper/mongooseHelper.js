import { isEmpty } from "./commonFUnction";
import ActivitySchema from '../models/front_models/activity.schema'
import Config from '../config/serverConfig'
import TokenOwners from "../models/front_models/tokenowner.schema";
import projectSchema from "../models/admin_models/project.schema";
// const Moralis = require("moralis").default;
// Moralis.start({ apiKey:'PmRtfcf7EgWJFamZ2OpKuEKVMA36PLdnunmpX8q9mNLQra4Jp1Stv1KwBCt8WfSY' });
// const fetch = require('node-fetch');
export const FindOne = async (data) => {
  const { DBName, FinData, SelData } = data;

  try {
    let FinOnData = await DBName.findOne(FinData, SelData);
    console.log("data type", data, FinOnData);
    return {
      success: !isEmpty(FinOnData) ? "success" : "error",
      msg: !isEmpty(FinOnData) ? FinOnData : null,
    };
  } catch (e) {
    return { success: "error", msg: e.toString() };
  }
};

export const Find = async (data) => {
  const { DBName, FinData, SelData, limit, skip } = data;
  console.log('daattaaa', data)
  try {
    if (limit) {
      var FinOnData = await DBName.find(FinData, SelData)
        .skip(skip)
        .limit(limit);
    } else {
      var FinOnData = await DBName.find(FinData, SelData);
    }

    return { success: "success", msg: FinOnData };
  } catch (e) {
    return { success: "error", msg: e.toString() };
  }
};
export const FindOneAndUpdate = async (data) => {
  const { DBName, FinData, Updata, save } = data;
  // console.log("FindOneAndUpdate",data);
  try {
    let FinOnUData = await DBName.findOneAndUpdate(FinData, Updata, save);

    return {
      success: FinOnUData ? "success" : "error",
      msg: FinOnUData ?? "Nothing To Update.. Try Again",
      data: FinOnUData,
    };
  } catch (e) {
    return { success: "error", msg: e.toString() };
  }
};
export const Save = async (data) => {
  const { DBName, Data } = data;
  console.log("datadatadatadatadata", data)
  try {
    let saveData = new DBName(Data);
    let FinOnUData = await saveData.save();
    return {
      success: FinOnUData ? "success" : "error",
      msg: !isEmpty(FinOnUData) ? FinOnUData : null,
      data: FinOnUData
    };
  } catch (e) {
    console.log('errrorrr', e)
    return { success: "error", msg: e.toString() };
  }
};

export const Aggregate = async (data) => {
  console.log("Aggregate data", data);
  const { DBName, Query } = data;
  try {
    var Que = await DBName.aggregate(Query);
    return {
      success: Que.length > 0 ? "success" : "error",
      msg: "OK",
      data: Que,
    };
  } catch (e) {
    console.log("Aggregate Error", e);

    return { success: "error", msg: e.toString() };
  }
};

export const FindOneAndRemove = async (data) => {
  const { DBName, FinData, Updata, save } = data;
  try {
    var record = await DBName.findOneAndRemove(FinData);
    // console.log("FindAnd Remove Calling",record)
    if (record != null) {
      return { success: "success", msg: record };
    }
  } catch (err) {
    return { success: "error", msg: err.toString() };
  }
};

export const Activity = async (data) => {
  const { Activity, From, To } = data;
  if (
    Activity === "Follow" ||
    Activity === "UnFollow" ||
    Activity === "Like" ||
    Activity === "DisLike"
  ) {
    var finVal = {
      DBName: ActivitySchema,
      FinData: { From: From, To: To },
      Updata: { $set: data },
      save: { new: true },
    };
    await FindOneAndUpdate(finVal);
  } else {
    var SenVal = { DBName: ActivitySchema, Data: data };
    var chk = await Save(SenVal);
    console.log("is saved orot", chk, SenVal)
  }
};

export const TokenList = async (data) => {
  const {
    ProfileUrl,
    limit,
    skip,
    tokenOwnerMatch,
    sort,
    TokenMatch,
    from,
    Tokens,
    TabName,
    filter
  } = data;
  // console.log('detailsssss',TokenMatch,sort,skip,limit)

  try {
    var Query = [
      {
        $match: TokenMatch,
      },
      {
        $lookup: {
          from: "users",
          let: { proName: "$NFTCreator" },
          pipeline: [
            { $match: { $expr: { $eq: ["$WalletAddress", "$$proName"] } } },
          ],
          as: "tokenCreator",
        },
      },
      {
        $unwind: {
          path: "$tokenCreator",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tokenowners",
          let: { tId: "$NFTId" },
          pipeline: [
            { $match: tokenOwnerMatch },

            {
              $lookup: {
                from: "users",
                let: { proName: "$NFTOwner" },
                pipeline: [
                  {
                    $match: { $expr: { $eq: ["$WalletAddress", "$$proName"] } },
                  },
                ],
                as: "tokenowners_user",
              },
            },
            {
              $unwind: {
                path: "$tokenowners_user",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "tokenowners_list",
        },
      },
      {
        $lookup: {
          from: "bids",
          let: { id: "$NFTId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  '$and': [
                    { '$eq': ["$NFTId", "$$id"] },
                    { '$ne': ["$PutOnSaleType", "FixedPrice"] }]
                }
              }
            },
            { $sort: { 'TokenBidAmt': -1 } },
            { $limit: 1 }
          ],
          as: "highbid",
        },
      },
      {
        $unwind: {
          path: "$highbid",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $unwind: "$tokenowners_list" },
      {
        $addFields: {
          NFTPrice: {
            $toDouble: { $cond: { if: { $eq: ["$tokenowners_list.NFTPrice", ""] }, then: "0", else: "$tokenowners_list.NFTPrice" } },
          }
        }
      },

      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          NFTId: 1,
          NFTName: 1,
          NFTOrginalImage: 1,
          NFTThumpImage: 1,
          CompressedFile: 1,
          CompressedThumbFile: 1,
          ContractAddress: 1,
          ContractType: 1,
          ContractName: 1,
          NFTCreator: 1,
          NFTRoyalty: 1,
          updatedAt: 1,
          CollectionNetwork: 1,
          NFTOrginalImageIpfs: 1,
          NFTDescription: 1,
          NFTOwner: "$tokenowners_list.NFTOwner",
          HashValue: "$tokenowners_list.HashValue",
          PutOnSale: "$tokenowners_list.PutOnSale",
          PutOnSaleType: "$tokenowners_list.PutOnSaleType",
          NFTPrice: "$tokenowners_list.NFTPrice",
          CoinName: "$tokenowners_list.CoinName",
          NFTQuantity: "$tokenowners_list.NFTQuantity",
          NFTBalance: "$tokenowners_list.NFTBalance",
          ClockTime: "$tokenowners_list.ClockTime",
          EndClockTime: "$tokenowners_list.EndClockTime",
          DisplayName: { $cond: { if: { $ne: ["$tokenowners_list.tokenowners_user.DisplayName", ''] }, then: "$tokenowners_list.tokenowners_user.DisplayName", else: { $concat: [{ $substr: ["$tokenowners_list.tokenowners_user.WalletAddress", 0, 3] }, "...", { $substr: ["$tokenowners_list.tokenowners_user.WalletAddress", 39, -1] }] } } },

          // DisplayName: "$tokenowners_list.tokenowners_user.DisplayName",
          CustomUrl: "$tokenowners_list.tokenowners_user.CustomUrl",
          WalletAddress: "$tokenowners_list.tokenowners_user.WalletAddress",
          // Profile: "$tokenowners_list.tokenowners_user.Profile",
          Cover: "$tokenowners_list.tokenowners_user.Cover",
          Creator_DisplayName: { $cond: { if: { $ne: ["$tokenCreator.DisplayName", ''] }, then: "$tokenCreator.DisplayName", else: { $concat: [{ $substr: ["$tokenCreator.WalletAddress", 0, 3] }, "...", { $substr: ["$tokenCreator.WalletAddress", 39, -1] }] } } },

          Creator_DisplayName: "$tokenCreator.DisplayName",
          Creator_CustomUrl: "$tokenCreator.CustomUrl",
          Creator_WalletAddress: "$tokenCreator.WalletAddress",
          Creator_Profile: "$tokenCreator.Profile",
          Creator_Cover: "$tokenCreator.Cover",
          TokenOwner_Name: "$tokenowners_list.TokenOwner_Name",
          highbidamount: "$highbid.TokenBidAmt",
          highbidcoin: "$highbid.CoinName",
          bannerpromotion: "$tokenowners_list.bannerpromotion"

          // Counts: { $cond: { if: { $isArray: "$TokenOwnerDetails" }, then: { $size: "$TokenOwnerDetails" }, else: 0} }
        },
      },
    ];
    // console.log("dsadasdasdhs",Query)
    var Agg = await Aggregate({ Query: Query, DBName: Tokens });
    console.log("Query Result", Query, sort)
    Agg.from = from;
    Agg.Count = 0
    return Agg;
  } catch (e) {
    console.log("Query Error", e)
    return { success: "error", msg: e.toString() };
  }
};

export const TokenInfo = async (data) => {
  const {
    ProfileUrl,
    limit,
    skip,
    tokenOwnerMatch,
    sort,
    TokenMatch,
    from,
    Tokens,
    TabName,
    NFTOwner,
    Id,
    myowner,
  } = data;

  try {
    var Query = [
      {
        $match: TokenMatch,
      },
      {
        $lookup: {
          from: "tokenowners",
          let: { tId: "$NFTId", pid: "$projectId" },
          pipeline: [
            { $match: myowner },

            {
              $lookup: {
                from: "users",
                let: { proName: "$NFTOwner" },
                pipeline: [
                  {
                    $match: { $expr: { $eq: ["$WalletAddress", "$$proName"] } },
                  },
                ],
                as: "tokenowners_users",
              },
            },
            {
              $unwind: {
                path: "$tokenowners_users",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $project: {
                _id: 1,
                NFTId: 1,
                NFTOwner: 1,
                HashValue: 1,
                PutOnSale: 1,
                PutOnSaleType: 1,
                NFTPrice: 1,
                CoinName: 1,
                NFTQuantity: 1,
                NFTBalance: 1,
                ClockTime: 1,
                EndClockTime: 1,
                updatedAt: 1,
                projectId: "$$pid",
                // { $cond: { if: { $isArray: "$NFTOwnerDetails" }, then: { $size: "$TokenOwnerDetails" }, else: 0} }
                DisplayName: { $cond: { if: { $ne: ["$tokenowners_users.DisplayName", ''] }, then: "$tokenowners_users.DisplayName", else: { $concat: [{ $substr: ["$tokenowners_users.WalletAddress", 0, 3] }, "...", { $substr: ["$tokenowners_users.WalletAddress", 3, -1] }] } } },
                CustomUrl: "$tokenowners_users.CustomUrl",
                WalletAddress: "$tokenowners_users.WalletAddress",
                Profile: "$tokenowners_users.Profile",
                Cover: "$tokenowners_users.Cover",
              },
            },
          ],
          as: "myowner",
        },
      },
      {
        $lookup: {
          from: "tokenowners",
          let: { tId: "$NFTId", pid: "$projectId" },
          pipeline: [
            { $match: tokenOwnerMatch },
            {
              $lookup: {
                from: "users",
                let: { proName: "$NFTOwner" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$WalletAddress", "$$proName"] }
                    },
                  },
                ],
                as: "tokenowners_user",
              },
            },
            {
              $unwind: {
                path: "$tokenowners_user",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "activities",
                let: { tId: "$NFTId", owner: "$tokenowners_user.WalletAddress" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$NFTId", "$$tId"] },
                          { $eq: ["$To", "$$owner"] },
                          // {$ne: ["$From","NullAddress"]},
                          { $ne: ["$NFTPrice", ""] },
                          {
                            $or: [
                              { $eq: ["$Activity", "Accept"] },
                              { $eq: ["$Activity", "Buy"] },
                              { $eq: ["$Activity", "Mint"] }
                            ]
                          },
                          // Activity
                        ]
                      }
                    }
                  },
                  { $limit: 1 },
                  { $sort: { updatedAt: -1 } },
                  {
                    $project: {
                      _id: 0,
                      NFTPrice: 1,
                      CoinName: 1
                    }
                  }
                ],
                as: "buyprice",
              }
            },
            {
              $unwind: {
                path: "$buyprice",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                NFTId: 1,
                NFTOwner: 1,
                HashValue: 1,
                PutOnSale: 1,
                PutOnSaleType: 1,
                NFTPrice: 1,
                CoinName: 1,
                NFTQuantity: 1,
                NFTBalance: 1,
                ClockTime: 1,
                EndClockTime: 1,
                updatedAt: 1,
                projectId: "$$pid",
                DisplayName: "$tokenowners_user.DisplayName",
                CustomUrl: "$tokenowners_user.CustomUrl",
                WalletAddress: "$tokenowners_user.WalletAddress",
                Profile: "$tokenowners_user.Profile",
                Cover: "$tokenowners_user.Cover",
                EmailId: "$tokenowners_user.EmailId",
                buyprice: "$buyprice"
              },
            },
          ],
          as: "tokenowners_list",
        },
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          foreignField: "WalletAddress",
          localField: "NFTCreator",
          as: "tokenCreator",
        },
      },
      {
        $unwind: {
          path: "$tokenCreator",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {

          NFTId: 1,
          NFTName: 1,
          NFTOrginalImage: 1,
          likecount: 1,

          NFTThumpImage: 1,
          CompressedFile: 1,
          NFTRoyalty: 1,
          CompressedThumbFile: 1,
          ContractAddress: 1,
          ContractType: 1,
          Category: 1,
          ContractName: 1,
          myowner: 1,
          NFTCreator: 1,
          MetaData: 1,
          NFTQuantity: 1,
          NFTOrginalImageIpfs: 1,
          NFTDescription: 1,
          updatedAt: 1,
          NFTOwnerDetails: 1,
          CollectionId: 1,
          CollectionNetwork: 1,
          tokenowners_list: 1,
          isStaked: 1,
          isMinted: 1,
          Creator_DisplayName: { $cond: { if: { $ne: ["$tokenCreator.DisplayName", ''] }, then: "$tokenCreator.DisplayName", else: { $concat: [{ $substr: ["$tokenCreator.WalletAddress", 0, 3] }, "...", { $substr: ["$tokenCreator.WalletAddress", 39, -1] }] } } },
          Creator_DisplayName: "$tokenCreator.DisplayName",
          Creator_CustomUrl: "$tokenCreator.CustomUrl",
          Creator_WalletAddress: "$tokenCreator.WalletAddress",
          Creator_Profile: "$tokenCreator.Profile",
          Creator_Cover: "$tokenCreator.Cover",
          Current_Owner: {
            $filter: {
              input: "$tokenowners_list",
              as: "item",
              cond: { $eq: ["$$item.NFTOwner", NFTOwner] },
            },
          },
          // "_id": { "$arrayElemAt": ["$tokenowners_list._id", 0] },
          NFTProperties: 1,
        },
      },
      
      { $unwind: "$Current_Owner" }
    ];

    var Agg = await Aggregate({ Query: Query, DBName: Tokens });
    console.log('Query  asfsff', JSON.stringify(Query, null, 2), Agg)
    Agg.from = from;
    return Agg;
  } catch (e) {
    //    // console.log(e)
    return { success: "error", msg: e.toString() };
  }
};
export const Explore = async (data) => {
  const {
    DBName,
    limit,
    sort,
    match,
    MyAdd
  } = data;

  try {
    var Query = [
      {
        $match: match,
      },
      { $limit: limit },
      { $sort: sort },
      {
        $lookup: {
          from: "tokens",
          let: { tId: "$NFTId" },
          pipeline: [
            { $match: { $expr: { $eq: ['$NFTId', '$$tId',] } } },
            {
              $lookup: {
                from: "users",
                pipeline: [
                  {
                    $match: { $expr: { $eq: ["$WalletAddress", MyAdd] } },
                  },
                ],
                as: "tokenowners_users",
              },
            },
            {
              $unwind: "$tokenowners_users"
            },
            {
              $lookup: {
                from: "users",
                foreignField: "WalletAddress",
                localField: "NFTCreator",
                as: "tokenCreator",
              },
            },
            {
              $unwind: {
                path: "$tokenCreator",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "Tokens",
        },
      },
      { $unwind: '$Tokens' },
      {
        $project: {
          _id: 0,
          NFTId: '$Tokens.NFTId',
          NFTName: '$Tokens.NFTName',
          NFTOrginalImage: '$Tokens.NFTOrginalImage',
          NFTThumpImage: '$Tokens.NFTThumpImage',
          CompressedFile: '$Tokens.CompressedFile',
          CompressedThumbFile: '$Tokens.CompressedThumbFile',
          ContractAddress: '$Tokens.ContractAddress',
          ContractType: '$Tokens.ContractType',
          ContractName: '$Tokens.ContractName',
          NFTCreator: '$Tokens.NFTCreator',
          NFTRoyalty: '$Tokens.NFTRoyalty',
          updatedAt: '$Tokens.updatedAt',
          CollectionNetwork: '$Tokens.CollectionNetwork',
          NFTOwner: 1,
          HashValue: 1,
          PutOnSale: 1,
          PutOnSaleType: 1,
          NFTPrice: 1,
          CoinName: 1,
          NFTQuantity: 1,
          NFTBalance: 1,
          ClockTime: 1,
          EndClockTime: 1,
          DisplayName: { $cond: { if: { $ne: ["$Tokens.tokenowners_list.tokenowners_user.DisplayName", ''] }, then: "$Tokens.tokenowners_list.tokenowners_user.DisplayName", else: { $concat: [{ $substr: ["$Tokens.tokenowners_list.tokenowners_user.WalletAddress", 0, 3] }, "...", { $substr: ["$Tokens.tokenowners_list.tokenowners_user.WalletAddress", 39, -1] }] } } },

          DisplayName: "$Tokens.tokenowners_list.tokenowners_user.DisplayName",
          CustomUrl: "$Tokens.tokenowners_list.tokenowners_user.CustomUrl",
          WalletAddress: "$Tokens.tokenowners_list.tokenowners_user.WalletAddress",
          Profile: "$Tokens.tokenowners_list.tokenowners_user.Profile",
          Cover: "$tokenowners_list.tokenowners_user.Cover",
          Creator_DisplayName: { $cond: { if: { $ne: ["$Tokens.tokenCreator.DisplayName", ''] }, then: "$Tokens.tokenCreator.DisplayName", else: { $concat: [{ $substr: ["$Tokens.tokenCreator.WalletAddress", 0, 3] }, "...", { $substr: ["$Tokens.tokenCreator.WalletAddress", 39, -1] }] } } },
          Creator_DisplayName: "$Tokens.tokenCreator.DisplayName",
          Creator_CustomUrl: "$Tokens.tokenCreator.CustomUrl",
          Creator_WalletAddress: "$Tokens.tokenCreator.WalletAddress",
          Creator_Profile: "$Tokens.tokenCreator.Profile",
          Creator_Cover: "$Tokens.tokenCreator.Cover",
          TokenOwner_Name: 1,

          // Counts: { $cond: { if: { $isArray: "$TokenOwnerDetails" }, then: { $size: "$TokenOwnerDetails" }, else: 0} }
        },
      },
    ];
    var Agg = await Aggregate({ Query: Query, DBName: DBName });
    Agg.from = "info-explore";
    return Agg;
  } catch (e) {
    //    // console.log(e)
    return { success: "error", msg: e.toString() };
  }
};

export const BidInfo = async (data, LimSkip) => {
  const { DBName, BidMatch, sort } = data;
  // console.log("sakdjhsakhdhshdaksjhdas",data)
  const { limit, skip } = LimSkip;
  var Query = [
    {
      $match: BidMatch,
    },
    {
      $sort: sort,
    },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "TokenBidderAddress",
        foreignField: "WalletAddress",
        as: "BidUsers",
      },
    },
    {
      $unwind: "$BidUsers",
    },
    {
      $project: {
        _id: 0,
        TokenBidAmt: 1,
        TokenBidderAddress: 1,
        NFTId: 1,
        status: 1,
        ContractAddress: 1,
        ContractType: 1,
        HashValue: 1,
        CoinName: 1,
        NFTQuantity: 1,
        Completed: 1,
        Pending: 1,
        updatedAt: 1,
        DisplayName: { $cond: { if: { $ne: ["$BidUsers.DisplayName", ''] }, then: "$BidUsers.DisplayName", else: { $concat: [{ $substr: ["$BidUsers.WalletAddress", 0, 3] }, "...", { $substr: ["$BidUsers.WalletAddress", 39, -1] }] } } },
        // DisplayName: "$BidUsers.DisplayName",
        EmailId: "$BidUsers.EmailId",
        // CustomUrl: "$BidUsers.CustomUrl",
        Profile: "$BidUsers.Profile",
        Cover: "$BidUsers.Cover",
        WalletAddress: "$BidUsers.WalletAddress",
        CustomUrl: "$BidUsers.CustomUrl",
      },
    },
  ];
  var Agg = await Aggregate({ Query: Query, DBName: DBName });
  Agg.from = "Bid";
  return Agg;
};
export const FollowUnFollowList = async (data, SendDta) => {
  const {
    Follow_Initial_Match,
    usermatchAdd,
    usermatchPro,
    unwind,
    from,
    fromTable,
  } = data;
  console.log('fdbdfhbgfollowww', data)
  const { limit, skip } = SendDta;
  try {
    var Query = [
      {
        $match: Follow_Initial_Match,
      },
      { $sort: { updatedAt: -1 } },
      { $unwind: unwind },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: "users",
          let: { ad: usermatchAdd, pr: usermatchPro },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$WalletAddress", "$$ad"] },
                  ],
                },
              },
            },
          ],
          as: "tokenowners_user",
        },
      },
      {
        $unwind: {
          path: "$tokenowners_user",
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $project: {
          _id: 0,
          DisplayName: { $cond: { if: { $ne: ["$tokenowners_user.DisplayName", ''] }, then: "$tokenowners_user.DisplayName", else: { $concat: [{ $substr: ["$tokenowners_user.WalletAddress", 0, 3] }, "...", { $substr: ["$tokenowners_user.WalletAddress", 39, -1] }] } } },
          ProfileUrl: "$tokenowners_user.ProfileUrl",
          CustomUrl: "$tokenowners_user.CustomUrl",
          WalletAddress: "$tokenowners_user.WalletAddress",
          Profile: "$tokenowners_user.Profile",
        },
      },
    ];
    var Agg = await Aggregate({ Query: Query, DBName: fromTable });
    Agg.from = from;
    console.log("Aggregate Error Checking", JSON.stringify(Query))

    return Agg;
  } catch (e) {
    return { success: "error", msg: e.toString() };
  }
};
export const CollectionList = async (data, SendDta) => {
  const {
    Follow_Initial_Match,
    unwind,
    from,
    fromTable,
  } = data;
  const { limit, skip } = SendDta;
  try {
    var Query = [
      {
        $match: Follow_Initial_Match,
      },
      { $sort: { updatedAt: -1 } },
      // { $unwind: unwind },
      { $skip: skip },
      { $limit: limit },

      {
        $project: {
          _id: 0,
          DisplayName: '$CollectionName',
          CollectionSymbol: 1,
          CollectionProfileImage: 1,
          CollectionNetwork: 1,
          CollectionContractAddress: 1,
          updatedAt: 1,
        },
      },
    ];
    var Agg = await Aggregate({ Query: Query, DBName: fromTable });
    Agg.from = from;
    console.log("Aggregate Error Checking", JSON.stringify(Query))

    return Agg;
  } catch (e) {
    return { success: "error", msg: e.toString() };
  }
};
export const MyItemList = async (data) => {
  console.log("Myitem datas", data)
  const {
    ProfileUrl,
    limit,
    skip,
    fromMatch,
    sort,
    refMatch,
    from,
    fromTable,
    refTable,
    NFTOwner
  } = data;
  try {
    var Query = [
      {
        $match: fromMatch,
      },
      { $sort: sort },
      {
        $lookup: {
          from: "users",
          let: { proName: "$NFTOwner" },
          pipeline: [
            { $match: { $expr: { $eq: ["$WalletAddress", "$$proName"] } } },
          ],
          as: "tokenowners_user",
        },
      },
      {
        $unwind: {
          path: "$tokenowners_user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "stakes",
          let: { tId: "$NFTId" },
          pipeline: [{
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$NFTId", "$$tId"] },
                  { $eq: ["$withdraw", false] },
                  { $eq: ["$walletAddress", NFTOwner] }
                ],
              },
            }
          }],
          as: "stakeDetais",
        },
      },
      {
        $lookup: {
          from: refTable,
          let: { tId: "$NFTId" },
          pipeline: [{ $match: refMatch }],
          as: "tokenowners_list",
        },
      },
      { $unwind: "$tokenowners_list" },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          NFTId: 1,
          NFTOwner: 1,
          HashValue: 1,
          PutOnSale: 1,
          PutOnSaleType: 1,
          NFTPrice: 1,
          CoinName: 1,
          NFTQuantity: 1,
          NFTBalance: 1,
          ClockTime: 1,
          EndClockTime: 1,
          updatedAt: 1,
          stakeDetais: "$stakeDetais",
          // Creator_DisplayName: "$tokencreator_list.DisplayName",
          // Creator_CustomUrl: "$tokencreator_list",
          // Creator_WalletAddress: "$tokencreator_list",
          // Creator_Cover: "$tokencreator_list",
          // Creator_Profile: "$tokencreator_list.Profile",
          NFTName: "$tokenowners_list.NFTName",
          isStaked: "$tokenowners_list.isStaked",
          projectId: "$tokenowners_list.projectId",
          tokenowners_list: "$tokenowners_list",
          // tokencreator_list: "$tokencreator_list",
          NFTOrginalImage: "$tokenowners_list.NFTOrginalImage",
          NFTThumpImage: "$tokenowners_list.NFTThumpImage",
          CompressedFile: "$tokenowners_list.CompressedFile",
          CompressedThumbFile: "$tokenowners_list.CompressedThumbFile",
          ContractAddress: "$tokenowners_list.ContractAddress",
          ContractType: "$tokenowners_list.ContractType",
          ContractName: "$tokenowners_list.ContractName",
          NFTCreator: "$tokenowners_list.NFTCreator",
          CollectionNetwork: "$tokenowners_list.CollectionNetwork",
          // Counts: { $cond: { if: { $isArray: "$NFTOwnerDetails" }, then: { $size: "$NFTOwnerDetails" }, else: 0} }
          DisplayName: { $cond: { if: { $ne: ["$tokenowners_user.DisplayName", ''] }, then: "$tokenowners_user.DisplayName", else: { $concat: [{ $substr: ["$tokenowners_user.WalletAddress", 0, 3] }, "...", { $substr: ["$tokenowners_user.WalletAddress", 39, -1] }] } } },

          // DisplayName: "$tokenowners_user.DisplayName",
          CustomUrl: "$tokenowners_user.CustomUrl",
          WalletAddress: "$tokenowners_user.WalletAddress",
          Profile: "$tokenowners_user.Profile",
          Cover: "$tokenowners_user.Cover",
        },
      },
    ];

    var Agg = await Aggregate({ Query: Query, DBName: fromTable });
    // var COUNT = await Find({ DBName: fromTable, FinData: fromMatch, SelData: {} })
    //    // console.log(Query)
    console.log("iuahfaihfawfwaf", JSON.stringify(Query, null, 2), Agg);
    if (from != "search") {
      const projectMatch = { $expr: { $eq: ["$_id", "$$proId"] } }

      const getLength = await getMyNftAndStackCount({ fromMatch, refMatch, projectMatch })
      Agg.totalvalues = getLength
    }

    // if (COUNT)
    //     Agg.Count = (COUNT.msg.map(item =>
    //         (item.NFTOwnerDetails).reduce((accumulator, currentValue) => accumulator + currentValue))).length
    Agg.from = from;
    //   // console.log("demo",Agg);

    return Agg;
  } catch (e) {
    // console.log("Aggregate Error Checking",e)
    return { success: "error", msg: e.toString() };
  }
};


/**
 * My Item - User Collection
 */

export const UserCollection = async (data, Array) => {
  try {


    console.log('1stt varanaaaa', data)
    var Arr = Array ?? []
    // var NFTs = await  Moralis.EvmApi.nft.getWalletNFTs(data);
    var getd = [...Arr, ...NFTs.result?.filter(item => !isEmpty(item._data.metadata))]
    // console.log("dsajkldasljdlasjkldjasldla",NFTs,NFTs.result[0])
    if (Number(getd.length) >= 8 || NFTs.result.length == 0 || NFTs.jsonResponse.cursor == null) {
      console.log("return Arr", Array?.length, getd.length, NFTs.result?.filter(item => !isEmpty(item._data.metadata)).length)

      var resdata = await getUri(getd);
      // console.log("resdata",resdata)
      return {
        success: Number(resdata.length) > 0 ? "success" : "error",
        msg: "OK",
        data: resdata,
        cursor: NFTs.jsonResponse.cursor
      }
    }
    else {
      return await UserCollection({
        chain: data.chain,
        address: data.address,
        limit: 20,
        cursor: NFTs.jsonResponse.cursor
      }, getd)
    }

  }
  catch (e) {
    console.log("dasdas", e)
    return false
  }
}



const getUri = async (data) => {
  var nftdata = [];

  try {

    if (data.length > 0) {
      await Promise.all(data.map(async item => {
        // console.log("get URI item",item?.EvmNft?.metadata)
        if (item._data.metadata && item._data.symbol !== Config.ContractNameSingle && item._data.symbol !== Config.ContractNameMultiple) {
          var tokenuri = item._data.metadata?.image
          var token_name = item._data.metadata?.name
          var ipfsurl = Config.IPFS_IMG
          if ((tokenuri?.includes("ipfs://")) || (tokenuri?.includes("ipfs:/")) || (tokenuri?.includes("ipfs/"))) {
            var spliturl = (((tokenuri).split("ipfs://").pop()).split("ipfs/").pop()).split("ipfs:/").pop()
            var tokenuri = ipfsurl + spliturl;
          }
          else {
            var tokenuri = tokenuri;
          }
          var path = tokenuri

          var initialdata = {
            colladdress: item.tokenAddress._value, //Value position Change with moralis updates
            tokenCounts: item._data.tokenId,
            type: item.contract_type?.includes('721') ? "721" : "1155",
            amount: item.amount,
            owner: item._data.ownerOf._value,
            title: item.name,
            name: token_name,
            image: path,
            ipfshash: spliturl,
            meta: item.tokenUri,
            metadata: item.metadata
            // cursor  : cursor
          }
          nftdata.push(initialdata)
        }
      }))

    }
    return nftdata;
  } catch (err) {
    console.log('getUriiii', err)
    return []
  }
}


export const TopCreator = async (data) => {
  const { sort, match } = data
  var Query = [
    { $match: match },
    {
      $sort: sort,
    },
    { $limit: 8 },
    {
      $group: {
        _id: '$To',
        value: {
          $sum: {
            $multiply: [
              {
                $toDouble: { $cond: { if: { $eq: ["$NFTPrice", ""] }, then: "0", else: "$NFTPrice" } },
              },
              {
                $toInt: "$NFTQuantity",
              },
            ],
          }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        let: { to: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$WalletAddress', '$$to'] }
            }
          }],
        as: 'user'
      }
    }
    , { $unwind: '$user' },
    {
      $project: {
        DisplayName: '$user.DisplayName',
        WalletAddress: '$user.WalletAddress',
        Profile: '$user.Profile',
        value: '$value',
        CustomUrl: "$user.CustomUrl"
      }
    }

  ]
  var Agg = await Aggregate({ Query: Query, DBName: ActivitySchema });
  Agg.from = "Top Creator";
  return Agg;
}

export const HomeCollectionFunc = async (data) => {
  const { sort, match, CollLimit, limit, DBNAME, tokenMatch, tab, filter, skip } = data
  var Query = [
    { $match: match },
    {
      $lookup: {
        from: "tokens",
        let: { symbol: "$CollectionSymbol" },
        pipeline: [
          { $match: { $expr: { $eq: ["$CollectionSymbol", "$$symbol"] } } },
          { $limit: 3 },
          { $count: 'token' },
          { $project: { token: 1 } }
        ],
        as: 'ValidCollection'
      }
    },
    { $unwind: '$ValidCollection' },
    { $match: { $expr: { $gte: ["$ValidCollection.token", 3] } } },
    { $limit: CollLimit },
    { $skip: skip },
    { $sort: { 'updatedAt': (filter == "old") ? 1 : -1 } },
    {
      $lookup: {
        from: 'users',
        let: { create: "$CollectionCreator" },
        pipeline: [
          { $match: { $expr: { $eq: ['$WalletAddress', '$$create'] } } },
          { $limit: 1 },
          {
            $project: {
              DisplayName: 1,
              CustomUrl: 1
            }
          }
        ],
        as: 'User'
      }
    },
    { $unwind: '$User' },
    {
      $lookup: {
        from: 'tokens',
        let: { symbol: "$CollectionSymbol" },
        pipeline: [
          { $match: tokenMatch },
          { $limit: limit },
          { $sort: sort },
          {
            $lookup: {
              from: "tokenowners",
              let: { tid: "$NFTId" },
              pipeline: [
                { $match: { $expr: { $eq: ['$$tid', '$NFTId'] } } },
                { $sort: { updatedAt: -1 } },
                { $limit: 1 },
                {
                  $project: {
                    NFTOwner: 1,
                    _id: 0
                  }
                },
              ],
              as: "TokenOwner"
            }
          },
          { $unwind: '$TokenOwner' },
          {
            $project: {
              NFTName: 1,
              NFTOrginalImage: 1,
              NFTThumpImage: 1,
              CompressedFile: 1,
              CompressedThumbFile: 1,
              // TokenOwner:1,
              Link: { $concat: ["/info/", "$CollectionNetwork", "/", "$ContractAddress", "/", "$TokenOwner.NFTOwner", "/", "$NFTId"] }
            }
          }
        ],
        as: 'Tokens'
      }
    },
    {
      $project: {
        CollectionName: 1,
        CollectionProfileImage: 1,
        CollectionSymbol: 1,
        CollectionType: 1,
        Category: 1,
        CollectionNetwork: 1,
        CollectionCreator: 1,
        // Tokens  : '$Tokens',
        DisplayName: '$User.DisplayName',
        CustomUrl: '$User.CustomUrl',
        CollectionCount: { $cond: { if: { $isArray: "$Tokens" }, then: { $size: "$Tokens" }, else: 0 } },
        Tokens: { $cond: { if: { $and: [{ $isArray: "$Tokens" }, { $gte: [{ $size: "$Tokens" }, 3] }] }, then: "$Tokens", else: [] } }
      }
    }

  ]
  var Agg = await Aggregate({ Query: Query, DBName: DBNAME });
  console.log('gfhbfdbdfb', JSON.stringify(Query))
  Agg.from = "Top Creator";
  return Agg;
}


export const ActivityList = async (data) => {
  const {
    limit,
    skip,
    sort,
    from,
    Tokens,
    TokenMatch
  } = data;
  console.log("crol", data)
  try {
    var Query = [
      {
        $match: TokenMatch,
      },

      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          let: { from: "$From" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $ne: ["$WalletAddress", ""],
                    },
                    {
                      $eq: ["$WalletAddress", "$$from"],
                    },
                  ],
                },
              },
            },
          ],
          as: "FromUsers",
        },
      },
      {
        $unwind: {
          path: "$FromUsers",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          let: { to: "$To" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $ne: ["$WalletAddress", ""],
                    },
                    {
                      $eq: ["$WalletAddress", "$$to"],
                    },
                  ],
                },
              },
            },
          ],
          as: "ToUsers",
        },
      },
      {
        $unwind: {
          path: "$ToUsers",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tokens",
          let: {
            tokenId: "$NFTId",
            contractAddress: "$ContractAddress",
            collectionNetwork: "$CollectionNetwork",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$NFTId", "$$tokenId"] },
                    { $eq: ["$CollectionNetwork", "$$collectionNetwork"] },
                    { $eq: ["$ContractAddress", "$$contractAddress"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                NFTName: 1,
                Category: 1,
                NFTOrginalImage: 1,
                NFTThumpImage: 1,
                NFTOrginalImageIpfs: 1,
                NFTThumpImageIpfs: 1,
                NFTCreator: 1,
                CompressedFile: 1,
                CompressedThumbFile: 1,
              },
            },
          ],
          as: "Tokens",
        },
      },
      { $unwind: { path: "$Tokens", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 0,
          TokenId: '$NFTId',
          TokenName: "$Tokens.NFTName",
          Category: 1,
          OriginalFile: "$Tokens.OriginalFile",
          OriginalThumbFile: "$Tokens.OriginalThumbFile",
          CompressedFile: "$Tokens.CompressedFile",
          CompressedThumbFile: "$Tokens.CompressedThumbFile",
          ContractAddress: 1,
          ContractType: 1,
          ContractName: 1,
          CollectionNetwork: 1,
          updatedAt: 1,
          usd: 1,
          Activity: 1,
          Creator: "$Tokens.NFTCreator",
          NFTPrice: 1,
          CoinName: 1,
          NFTQuantity: 1,
          HashValue: 1,
          Type: 1,
          From: 1,
          From_Name: 1,
          From_Profile: "$FromUsers.Profile",
          From_CustomUrl: "$FromUsers.CustomUrl",
          From_DisplayName: { $cond: { if: { $ne: ["$FromUsers.DisplayName", ''] }, then: "$FromUsers.DisplayName", else: { $concat: [{ $substr: ["$FromUsers.WalletAddress", 0, 3] }, "...", { $substr: ["$FromUsers.WalletAddress", 39, -1] }] } } },

          // From_DisplayName: "$FromUsers.DisplayName",
          To: 1,
          To_Name: 1,
          To_Profile: "$ToUsers.Profile",
          To_CustomUrl: "$ToUsers.CustomUrl",
          To_DisplayName: { $cond: { if: { $ne: ["$ToUsers.DisplayName", ''] }, then: "$ToUsers.DisplayName", else: { $concat: [{ $substr: ["$ToUsers.WalletAddress", 0, 3] }, "...", { $substr: ["$ToUsers.WalletAddress", 39, -1] }] } } },

        },
      },
    ];
    var Agg = await Aggregate({ Query: Query, DBName: Tokens });
    console.log("mukam katu ne ", JSON.stringify(Query));

    Agg.from = from;
    return Agg;
  } catch (e) {
    console.log(e);
    return { success: "error", msg: e.toString() };
  }
};

export const CollectionListBySymbol = async (data) => {
  const {
    CollectionSymbol,
    limit,
    skip,
    tokenOwnerMatch,
    CollectionMatch,
    sort,
    TokenMatch,
    from,
    Tokens,
    TabName,
  } = data;

  try {
    var Query = [
      {
        $match: TokenMatch,
      },
      {
        $lookup: {
          from: "tokenowners",
          let: { tId: "$NFTId" },
          pipeline: [
            { $match: tokenOwnerMatch },

            {
              $lookup: {
                from: "users",
                let: { proName: "$NFTOwner" },
                pipeline: [
                  {
                    $match: { $expr: { $eq: ["$WalletAddress", "$$proName"] } },
                  },
                ],
                as: "tokenowners_user",
              },
            },
            {
              $unwind: {
                path: "$tokenowners_user",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "tokenowners_list",
        },
      },
      { $unwind: "$tokenowners_list" },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          NFTId: 1,
          NFTName: 1,
          NFTOrginalImage: 1,
          NFTThumpImage: 1,
          CompressedFile: 1,
          CompressedThumbFile: 1,
          ContractAddress: 1,
          ContractType: 1,
          ContractName: 1,
          NFTCreator: 1,
          NFTRoyalty: 1,
          updatedAt: 1,
          CollectionNetwork: 1,
          NFTOwner: "$tokenowners_list.NFTOwner",
          HashValue: "$tokenowners_list.HashValue",
          PutOnSale: "$tokenowners_list.PutOnSale",
          PutOnSaleType: "$tokenowners_list.PutOnSaleType",
          NFTPrice: "$tokenowners_list.NFTPrice",
          CoinName: "$tokenowners_list.CoinName",
          NFTQuantity: "$tokenowners_list.NFTQuantity",
          NFTBalance: "$tokenowners_list.NFTBalance",
          ClockTime: "$tokenowners_list.ClockTime",
          EndClockTime: "$tokenowners_list.EndClockTime",
          DisplayName: { $cond: { if: { $ne: ["$tokenowners_list.tokenowners_user.DisplayName", ''] }, then: "$tokenowners_list.tokenowners_user.DisplayName", else: { $concat: [{ $substr: ["$tokenowners_list.tokenowners_user.WalletAddress", 0, 3] }, "...", { $substr: ["$tokenowners_list.tokenowners_user.WalletAddress", 39, -1] }] } } },

          // DisplayName: "$tokenowners_list.tokenowners_user.DisplayName",
          CustomUrl: "$tokenowners_list.tokenowners_user.CustomUrl",
          WalletAddress: "$tokenowners_list.tokenowners_user.WalletAddress",
          // Profile: "$tokenowners_list.tokenowners_user.Profile",
          Cover: "$tokenowners_list.tokenowners_user.Cover",
          TokenOwner_Name: "$tokenowners_list.TokenOwner_Name",

          // Counts: { $cond: { if: { $isArray: "$TokenOwnerDetails" }, then: { $size: "$TokenOwnerDetails" }, else: 0} }
        },
      },
    ];

    console.log('Query ON Dta', JSON.stringify(Query, null, 2))
    var Agg = await Aggregate({ Query: Query, DBName: Tokens });
    console.log("Query Result", Agg)
    Agg.from = from;
    Agg.Count = 0
    return Agg;
  } catch (e) {
    // console.log("Query Error"e)
    return { success: "error", msg: e.toString() };
  }
};

export const ExplorewithActivity = async (data) => {
  var { Activitymatch, tokenOwnerMatch, skip, limit } = data
  // console.log('hiiiiiii',Activitymatch,tokenOwnerMatch,skip,limit)
  try {
    //new one for new owner
    var Query = [
      {
        $match: { $expr: Activitymatch },
      },
      { $group: { _id: "$NFTId", "NFTId": { $last: "$NFTId" }, "updatedAt": { $last: "$updatedAt" } } },
      {
        $lookup: {
          from: "tokens",
          let: { "nftid": "$NFTId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$$nftid", "$NFTId"] },
                    { $eq: ["$reported", false] },
                  ]
                }
              },
            },
          ],
          as: "NFT"
        }
      },
      { $unwind: "$NFT" },
      {
        $lookup: {
          from: "tokenowners",
          let: { tId: "$NFT.NFTId" },
          pipeline: [
            { $match: tokenOwnerMatch }
          ],
          as: "tokenowners_list",
        },
      },
      {
        "$unwind": "$tokenowners_list"
      },
      {
        $lookup: {
          from: "users",
          let: { proName: "$tokenowners_list.NFTOwner" },
          pipeline: [
            {
              $match: { $expr: { $eq: ["$WalletAddress", "$$proName"] } },
            },
          ],
          as: "tokenowners_user",
        },
      },
      {
        $unwind: {
          path: "$tokenowners_user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "bids",
          let: { id: "$NFT.NFTId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  '$and': [
                    { '$eq': ["$NFTId", "$$id"] },
                    { '$ne': ["$PutOnSaleType", "FixedPrice"] }]
                }
              }
            },
            { $sort: { 'TokenBidAmt': -1 } },
            { $limit: 1 }
          ],
          as: "highbid",
        },
      },
      {
        $unwind: {
          path: "$highbid",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { updatedAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: "$NFT._id",
          NFTId: "$NFT.NFTId",
          NFTName: "$NFT.NFTName",
          NFTOrginalImage: "$NFT.NFTOrginalImage",
          NFTThumpImage: "$NFT.NFTThumpImage",
          CompressedFile: "$NFT.CompressedFile",
          CompressedThumbFile: "$NFT.CompressedThumbFile",
          NFTOrginalImageIpfs: "$NFT.NFTOrginalImageIpfs",
          NFTDescription: "$NFT.NFTDescription",
          ContractAddress: "$NFT.ContractAddress",
          ContractType: "$NFT.ContractType",
          ContractName: "$NFT.ContractName",
          NFTCreator: "$NFT.NFTCreator",
          NFTRoyalty: "$NFT.NFTRoyalty",
          updatedAt: "$NFT.updatedAt",
          CollectionNetwork: "$NFT.CollectionNetwork",
          NFTOwner: "$tokenowners_list.NFTOwner",
          HashValue: "$tokenowners_list.HashValue",
          PutOnSale: "$tokenowners_list.PutOnSale",
          PutOnSaleType: "$tokenowners_list.PutOnSaleType",
          NFTPrice: "$tokenowners_list.NFTPrice",
          CoinName: "$tokenowners_list.CoinName",
          NFTQuantity: "$tokenowners_list.NFTQuantity",
          NFTBalance: "$tokenowners_list.NFTBalance",
          ClockTime: "$tokenowners_list.ClockTime",
          EndClockTime: "$tokenowners_list.EndClockTime",
          DisplayName: { $cond: { if: { $ne: ["$tokenowners_list.tokenowners_user.DisplayName", ''] }, then: "$tokenowners_list.tokenowners_user.DisplayName", else: { $concat: [{ $substr: ["$tokenowners_list.tokenowners_user.WalletAddress", 0, 3] }, "...", { $substr: ["$tokenowners_list.tokenowners_user.WalletAddress", 39, -1] }] } } },

          // DisplayName: "$tokenowners_list.tokenowners_user.DisplayName",
          CustomUrl: "$tokenowners_list.tokenowners_user.CustomUrl",
          WalletAddress: "$tokenowners_list.tokenowners_user.WalletAddress",
          // Profile: "$tokenowners_list.tokenowners_user.Profile",
          Cover: "$tokenowners_list.tokenowners_user.Cover",
          // Creator_DisplayName: { $cond: { if: { $ne: ["$tokenCreator.DisplayName", ''] }, then: "$tokenCreator.DisplayName", else: { $concat: [{ $substr: ["$tokenCreator.WalletAddress", 0, 3] }, "...", { $substr: ["$tokenCreator.WalletAddress", 39, -1] }] } } },

          // Creator_DisplayName: "$tokenCreator.DisplayName",
          // Creator_CustomUrl: "$tokenCreator.CustomUrl",
          // Creator_WalletAddress: "$tokenCreator.WalletAddress",
          // Creator_Profile: "$tokenCreator.Profile",
          // Creator_Cover: "$tokenCreator.Cover",
          TokenOwner_Name: "$tokenowners_list.TokenOwner_Name",
          highbidamount: "$highbid.TokenBidAmt",
          highbidcoin: "$highbid.CoinName",
          "cur_owner_DisplayName": "$tokenowners_user.DisplayName",
          "cur_owner_Profile": "$tokenowners_user.Profile",
          "cur_owner_CustomUrl": "$tokenowners_user.CustomUrl",
          // Counts: { $cond: { if: { $isArray: "$TokenOwnerDetails" }, then: { $size: "$TokenOwnerDetails" }, else: 0} }
        },
      },
    ]
    var Agg = await Aggregate({ Query: Query, DBName: ActivitySchema });
    console.log('datttaaasss', Agg.data[0])
    return Agg;
  } catch (e) {
    // console.log("Query Error"e)
    return { success: "error", msg: e.toString() };
  }
}


export const OtherCollection = async (data, from, Array) => {
  try {
    // const serverUrl = Config.MoralisserverUrl;
    // const appId = Config.MoralisappId;

    // console.log('1stt varanaaaa',data,start)
    var Arr = Array ?? []
    // var NFTs = await  Moralis.EvmApi.nft.getContractNFTs(data);
    // console.log('tessstttdatta',NFTs)
    var getd = [...Arr, ...NFTs?.jsonResponse?.result?.filter(item => !isEmpty(item?.metadata))]
    var size = from == 'check' ? 1 : 8;
    //  console.log("dsajkldasljdlasjkldjasldla",from,getd.length,size,Number(getd.length)>=size,NFTs)
    if (Number(getd.length) >= size || NFTs.result.length == 0 || NFTs.jsonResponse.cursor == null) {
      // console.log("return Arr",Array?.length , getd.length, NFTs.result?.filter(item=>!isEmpty(item._data.metadata)).length)
      var resdata = await getUri1(getd);
      // console.log("resdata",resdata)
      return {
        success: Number(resdata.length) > 0 ? "success" : "error",
        msg: "OK",
        data: resdata,
        cursor: NFTs.jsonResponse.cursor
      }

    }
    else {
      return await OtherCollection({
        chain: data.chain,
        address: data.address,
        limit: 20,
        cursor: NFTs.jsonResponse.cursor
      }, from, getd)
    }

  }
  catch (e) {
    console.log("dasdas", e, e.toString())
    if (e.toString() == "Moralis SDK Core Error: [C0005] Invalid address provided") {
      return {
        success: "error",
        msg: "OK",
        data: "Invalid Address Provided",
        cursor: null
      }
    }
    else return false
  }
}

const getUri1 = async (data) => {
  var nftdata = [];

  try {

    if (data.length > 0) {
      await Promise.all(data.map(async item => {
        if (item.metadata) {
          var metadata = JSON.parse(item.metadata)
          // console.log('dattttaaaaaa11111',JSON.parse(item.metadata),item.metadata,typeof(item.metadata),metadata,metadata?.image)
          var tokenuri = metadata?.image || metadata?.imagehash
          var token_name = metadata?.name
          var ipfsurl = Config.IPFS_IMG
          if ((tokenuri?.includes("ipfs://")) || (tokenuri?.includes("ipfs:/")) || (tokenuri?.includes("ipfs/"))) {
            var spliturl = (((tokenuri).split("ipfs://").pop()).split("ipfs/").pop()).split("ipfs:/").pop()
            var tokenuri = ipfsurl + spliturl;
          }
          else {
            var tokenuri = tokenuri;
          }
          var path = tokenuri


          var initialdata = {
            colladdress: item.token_address, //Value position Change with moralis updates
            tokenCounts: item.token_id,
            type: item.contract_type?.includes('721') ? "721" : "1155",
            amount: item.amount,
            creator: item.minter_address,
            title: item.name,
            name: token_name,
            image: path,
            ipfshash: spliturl,
            meta: item.token_uri,
            metadata: metadata,
            // cursor  : cursor
          }
          // console.log('before arrraayyyy',initialdata)
          nftdata.push(initialdata)
        }
      }))

    }
    console.log('nffftttt', nftdata)
    return nftdata;
  } catch (err) {
    console.log('getUriiii', err)
    return []
  }
}

export const GetOwner = async (data) => {
  try {
    // var resdata = await Moralis.EvmApi.nft.getNFTTokenIdOwners(data)
    console.log('owwwneeerrrr', resdata.jsonResponse.result[0])
    console.log("get URI item", resdata)
    return {
      success: Number(resdata.jsonResponse.result.length) > 0 ? "success" : "error",
      msg: "OK",
      data: resdata,
    }
  } catch (err) {
    console.log('gettt ownerr', err)
  }
}

export const getMyNftAndStackCount = async (data) => {
  const { fromMatch, refMatch, projectMatch } = data
  try {
    const query = [
      { $match: fromMatch },
      {
        "$lookup": {
          "from": "tokens",
          "let": {
            "tId": "$NFTId"
          },
          "pipeline": [
            {
              "$match": refMatch
            },
            {
              $lookup: {
                from: "project",
                let: { proId: { $toObjectId: "$projectId" } },
                pipeline: [
                  { $match: projectMatch }

                ],
                as: "projectDetails",
              },
            },
            { $unwind: "$projectDetails" }
          ],
          "as": "token_details"
        }
      },
      {
        "$unwind": "$token_details"
      },
      {
        $project: {
          projectId: "$token_details.projectDetails._id",
          projectTitle: "$token_details.projectDetails.projectTitle",
          isCompleted: "$token_details.projectDetails.isCompleted",
          value: "$token_details.projectDetails.projectTitle",
          label: "$token_details.projectDetails.projectTitle",
          ProjectThumbnail: "$token_details.projectDetails.ProjectThumbnail",
          mintPrice: "$token_details.projectDetails.mintPrice",
          NFTPrice: "$token_details.projectDetails.NFTPrice",
          isStaked: "$token_details.isStaked",
        }
      }
    ];

    console.log("Queryyy", JSON.stringify(query, null, 2));
    const getData = await TokenOwners.aggregate(query)

    return getData
  } catch (error) {
    console.log("error on getMyNftAndStackCount", error);
    return []
  }
}


export const myItemSearch = async (data) => {
  const { fromMatch, refMatch, collectionMatch, skip, limit } = data
  try {
    const getData = await TokenOwners.aggregate([
      {
        $match: fromMatch,
      },
      {
        $lookup: {
          from: "tokens",
          let: { tId: "$NFTId" },
          pipeline: [
            {
              $match: refMatch
            },
            {
              $lookup: {
                from: "galleries",
                let: { galId: { $toObjectId: "$CollectionId" } },
                pipeline: [
                  { $match: collectionMatch },
                  {
                    $lookup: {

                      from: "project",
                      let: { proId: { $toObjectId: "$projectId" } },
                      pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$proId"] } } }

                      ],
                      as: "projectId"
                    }
                  },
                  { $unwind: "$projectId" }
                ],
                as: "collectionDetails",
              },
            },
            { $unwind: "$collectionDetails" }

          ],
          as: "tokenowners_list",
        },
      },
      { $unwind: "$tokenowners_list" },
      {
        $group: {
          _id: "$tokenowners_list.collectionDetails._id",
          galleryDetail: { $first: "$tokenowners_list.collectionDetails" }
        }
      },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          galleryTitle: "$galleryDetail.galleryTitle",
          galleryThumbImage: "$galleryDetail.galleryThumbImage",
          galleryDescription: "$galleryDetail.galleryDescription",
          projectId: "$galleryDetail.projectId",
          createdAt: "$galleryDetail.createdAt",
        }
      }
    ])

    return getData

  } catch (e) {
    console.log("err on searchitewm", e);
    return []
  }
}


export const projectTokenCount = async (data) => {
  try {
    return await projectSchema.aggregate([
      { $match: data.data },
      {
        $lookup: {
          from: "tokens",
          let: { galId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: [{ $toObjectId: "$projectId" }, "$$galId"] } } },
            {
              $group: {
                _id: undefined,
                minted: { $sum: 1 },
                isMintTrue: { $sum: { $cond: { if: { $eq: ["$isMinted", true] }, then: 1, else: 0 } } },
                isMintFalse: { $sum: { $cond: { if: { $eq: ["$isMinted", false] }, then: 1, else: 0 } } },
                locked: { $sum: { $cond: { if: { $and: [{ $gt: ["$UnlockAt", new Date()] }, { $eq: ["$isMinted", false] }] }, then: 1, else: 0 } } },
                isAvailable: data.isavailable
              }
            }
          ],
          as: "tokens"
        }
      },
      { $unwind: "$tokens" },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          projectDescription: 1,
          maxNFTs: 1,
          mintPrice: 1,
          NFTPrice: 1,
          symbol: 1,
          baseUri: 1,
          royaltyReceiver: 1,
          duration: 1,
          NFTRoyalty: 1,
          aboutProject: 1,
          aboutDescription: 1,
          ProjectThumbnail: 1,
          AboutProjectThumbnail: 1,
          contractAddress: 1,
          unlockAt: 1,
          isCompleted: 1,
          roadMap: 1,
          projectTitle: 1,
          CMS: 1,
          propertyValue:1,
          mintToken:1,
          mintTokenName:1,
          fundReceiverAddress:1,
          locked: { $sum: "$tokens.locked" },
          isMinted: { $sum: "$tokens.isMintTrue" },
          isNotMinted: { $sum: "$tokens.isMintFalse" },
          totalMinted: { $sum: "$tokens.minted" },
          isAvailable: { $sum: "$tokens.isAvailable" },
        }
      }
    ])
  } catch (error) {
    console.log(" erron projectTokenCount", error);
  }
}