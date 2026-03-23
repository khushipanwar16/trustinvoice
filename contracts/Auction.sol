// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./InvoiceNFT.sol";

contract Auction {

    InvoiceNFT public invoiceNFT;

    struct Listing {
        uint256 nftId;
        address seller;
        uint256 minBid;
        uint256 highestBid;
        address highestBidder;
        bool    isActive;
        bool    isSettled;
    }

    mapping(uint256 => Listing) public listings;

    event Listed(uint256 nftId, uint256 minBid);
    event BidPlaced(uint256 nftId, address bidder, uint256 amount);
    event BidAccepted(uint256 nftId, address winner, uint256 amount);

    constructor(address _nftContract) {
        invoiceNFT = InvoiceNFT(_nftContract);
    }

    function listInvoice(uint256 _nftId, uint256 _minBid) public {
        require(invoiceNFT.ownerOf(_nftId) == msg.sender, "Not your NFT");

        invoiceNFT.transferFrom(msg.sender, address(this), _nftId);

        listings[_nftId] = Listing({
            nftId:         _nftId,
            seller:        msg.sender,
            minBid:        _minBid,
            highestBid:    0,
            highestBidder: address(0),
            isActive:      true,
            isSettled:     false
        });

        emit Listed(_nftId, _minBid);
    }

    function placeBid(uint256 _nftId) public payable {
        Listing storage l = listings[_nftId];
        require(l.isActive, "Not active");
        require(msg.value > l.highestBid, "Bid too low");
        require(msg.value >= l.minBid, "Below minimum");

        if (l.highestBidder != address(0)) {
            payable(l.highestBidder).transfer(l.highestBid);
        }

        l.highestBid    = msg.value;
        l.highestBidder = msg.sender;

        emit BidPlaced(_nftId, msg.sender, msg.value);
    }

    function acceptBid(uint256 _nftId) public {
        Listing storage l = listings[_nftId];
        require(l.seller == msg.sender, "Not seller");
        require(l.isActive, "Not active");
        require(l.highestBidder != address(0), "No bids");

        l.isActive  = false;
        l.isSettled = true;

        payable(l.seller).transfer(l.highestBid);
        invoiceNFT.transferFrom(address(this), l.highestBidder, _nftId);

        emit BidAccepted(_nftId, l.highestBidder, l.highestBid);
    }

    function getListing(uint256 _nftId) public view returns (Listing memory) {
        return listings[_nftId];
    }
}