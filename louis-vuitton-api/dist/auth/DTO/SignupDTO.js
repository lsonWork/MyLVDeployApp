"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupDTO = void 0;
const account_role_enum_1 = require("../account-role.enum");
const class_validator_1 = require("class-validator");
class SignupDTO {
}
exports.SignupDTO = SignupDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Username should not be empty' }),
    (0, class_validator_1.Matches)(/^[A-Za-z0-9]+$/, {
        message: 'Username should contain only letters and numbers',
    }),
    __metadata("design:type", String)
], SignupDTO.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password should not be empty' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/, {
        message: 'Password must has length [8-16], contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
    __metadata("design:type", String)
], SignupDTO.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(account_role_enum_1.AccountRole, {
        message: 'Role must be ADMIN, SELLER or CUSTOMER',
    }),
    __metadata("design:type", String)
], SignupDTO.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Fullname should not be empty' }),
    (0, class_validator_1.Matches)(/^[A-Za-z\s]+$/, {
        message: 'Fullname should contain only letters (a-zA-Z)',
    }),
    __metadata("design:type", String)
], SignupDTO.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email.' }),
    __metadata("design:type", String)
], SignupDTO.prototype, "email", void 0);
//# sourceMappingURL=SignupDTO.js.map