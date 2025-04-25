// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// TODO: allow company to set timestamp

contract Paygramchain is AccessControl, Ownable {
    error PayGramChain_Token_Exist();
    error PayGramChain_Company_Already_Registered();
    error PayGramChain_Employee_Not_Found();
    error PayGramChain_Payment_Not_Due();
    error PayGramChain_Transfer_Failed();
    error Paygramchain_Company_Dose_Not_Exist();

    event CompanyRegistered(
        address indexed company,
        address indexed token,
        uint256 amount
    );
    event EmployeeAdded(
        address indexed company,
        address indexed employee,
        uint256 salary,
        address token
    );
    event SalaryDistributed(
        address indexed company,
        address indexed employee,
        uint256 salary,
        address token
    );
    event TokenAdded(address indexed token);

    // using IERC20 for IERC20;
    uint256 public employeeLength;

    struct Employee {
        address company;
        address employeeAddress;
        address token;
        uint256 salary;
        uint256 totalPaid;
        uint256 lastPayment;
        bool isPaid;
    }

    struct CompanyConfig {
        address token;
        address company;
        uint256 balance;
        uint256 paymentInterval;
    }

    mapping(uint256 => Employee) public _employee;
    mapping(address => CompanyConfig) public _company;
    mapping(address => bool) _supportedToken;
    uint256 public FEE = 5;
    bytes32 public constant ADMIN_PAY_ROLE = keccak256("ADMIN_PAY_ROLE");

    constructor() Ownable(msg.sender) {
        _grantRole(ADMIN_PAY_ROLE, msg.sender);
        _setRoleAdmin(ADMIN_PAY_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(ADMIN_PAY_ROLE, DEFAULT_ADMIN_ROLE);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function registerCompany(
        address token,
        uint256 _amount,  uint256 _paymentInterval
    ) external onlyRole(ADMIN_PAY_ROLE) {
        if (_company[msg.sender].company != address(0))
            revert PayGramChain_Company_Already_Registered();

        uint256 fee = (_amount * FEE) / 100;
        uint256 amountAfterFee = _amount - fee;

        require(
            IERC20(token).transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );

        require(IERC20(token).transfer(owner(), fee), "Fee transfer failed");

        _company[msg.sender] = CompanyConfig(token, msg.sender, amountAfterFee,  _paymentInterval);
        emit CompanyRegistered(msg.sender, token, amountAfterFee);
    }

    function grantADMIN_PAY_ROLE(address _account) external onlyOwner {
        _grantRole(ADMIN_PAY_ROLE, _account);
    }

    function addEmployee(
        address _companyAddress,
        address _employeeAddress,
        uint256 _salary,
        address token
    ) public onlyRole(ADMIN_PAY_ROLE) {
        CompanyConfig storage company = _company[_companyAddress];
        if (company.company != msg.sender) {
            revert Paygramchain_Company_Dose_Not_Exist();
        }
        _employee[employeeLength] = Employee(
            company.company,
            _employeeAddress,
            token,
            _salary,
            0,
            block.timestamp,
            false
        );
        employeeLength++;
        emit EmployeeAdded(msg.sender, _employeeAddress, _salary, token);
    }

     function distributeSalary(uint256 _employeeId) public onlyRole(ADMIN_PAY_ROLE) {
        Employee storage employee = _employee[_employeeId];
        CompanyConfig storage company = _company[employee.company];
        if (employee.company == address(0))
            revert PayGramChain_Employee_Not_Found();
        if (block.timestamp < employee.lastPayment + company.paymentInterval * 1 days)
            revert PayGramChain_Payment_Not_Due();
        if (company.balance < employee.salary)
            revert PayGramChain_Transfer_Failed();
        if (
            !IERC20(employee.token).transferFrom(
                employee.company,
                employee.employeeAddress,
                employee.salary
            )
        ) revert PayGramChain_Transfer_Failed();
        company.balance -= employee.salary; 
        employee.lastPayment = block.timestamp;
        employee.totalPaid += employee.salary;
        employee.isPaid = true;
        emit SalaryDistributed(
            employee.company,
            employee.employeeAddress,
            employee.salary,
            employee.token
        );
    }

    function addToken(address _token) public onlyOwner {
        if (_supportedToken[_token]) revert PayGramChain_Token_Exist();
        _supportedToken[_token] = true;
        emit TokenAdded(_token);
    }
}
