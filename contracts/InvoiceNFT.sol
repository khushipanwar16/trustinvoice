// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract InvoiceNFT is ERC721 {

    uint256 private _tokenIds;

    struct Invoice {
        uint256 id;
        address seller;
        address buyer;
        uint256 amount;
        uint256 dueDate;
        string  proofHash;
        bool    isPaid;
        bool    isListed;
        bool    isDefaulted;   // ✅ Added
    }

    mapping(uint256 => Invoice) public invoices;
    uint256 public totalMinted;

    mapping(address => uint256) public reputationScore;

    event InvoiceMinted(uint256 indexed id, address seller, uint256 amount);
    event InvoicePaid(uint256 indexed id);
    event InvoiceDefaulted(uint256 indexed id); // ✅ Added

    constructor() ERC721("TrustInvoice", "TINV") {}

    function mintInvoice(
        address _buyer,
        uint256 _amount,
        uint256 _dueDate,
        string memory _proofHash
    ) public returns (uint256) {

        _tokenIds++;
        totalMinted = _tokenIds;

        uint256 newId = _tokenIds;

        _mint(msg.sender, newId);

        invoices[newId] = Invoice({
            id:        newId,
            seller:    msg.sender,
            buyer:     _buyer,
            amount:    _amount,
            dueDate:   _dueDate,
            proofHash: _proofHash,
            isPaid:    false,
            isListed:  false,
            isDefaulted: false
        });

        emit InvoiceMinted(newId, msg.sender, _amount);

        return newId;
    }



    function markAsPaid(uint256 _id) public {

        require(invoices[_id].buyer == msg.sender, "Only buyer can confirm");
        require(!invoices[_id].isPaid, "Already paid");

        invoices[_id].isPaid = true;

        reputationScore[msg.sender] += 10;

        emit InvoicePaid(_id);
    }



    function getInvoice(uint256 _id) public view returns (Invoice memory) {
        return invoices[_id];
    }



    function payInvoice(uint256 _id) public payable {

        Invoice storage inv = invoices[_id];

        require(inv.buyer == msg.sender, "Only buyer can pay");
        require(!inv.isPaid, "Already paid");
        require(!inv.isDefaulted, "Invoice defaulted");  // ✅ Added
        require(msg.value >= inv.amount, "Insufficient payment");

        inv.isPaid = true;

        payable(inv.seller).transfer(msg.value);

        reputationScore[msg.sender] += 10;

        emit InvoicePaid(_id);
    }



    // ✅ Default detection
    function markDefault(uint256 _id) public {

        Invoice storage inv = invoices[_id];

        require(!inv.isPaid, "Already paid");
        require(!inv.isDefaulted, "Already defaulted");
        require(block.timestamp > inv.dueDate, "Not overdue");

        inv.isDefaulted = true;

        // reduce reputation
        if (reputationScore[inv.buyer] > 10) {
            reputationScore[inv.buyer] -= 10;
        } else {
            reputationScore[inv.buyer] = 0;
        }

        emit InvoiceDefaulted(_id);
    }



    // ✅ listing control for auction
    function setListed(uint256 _id, bool _status) public {
        invoices[_id].isListed = _status;
    }



    // ✅ reputation getter
    function getReputation(address user) public view returns(uint256) {
        return reputationScore[user];
    }

}