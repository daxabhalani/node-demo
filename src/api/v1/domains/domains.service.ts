import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { Domain, User } from '../../../shared/interface/model.interface';
import { CreateDomain, PaginationDto } from './domains.dto';

@Injectable()
export class DomainsService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Domain') private readonly domainModel: Model<Domain>,
  ) {}

  getPaginateQuery(page: any, limit: any) {
    const pageNumber = Number(page);
    const parsedLimit = Number(limit);
    return {
      skip: (pageNumber - 1) * parsedLimit,
      limit: parsedLimit,
    };
  }
  // Fetch all domains with pagination
  async getAllDomains(query: PaginationDto, res: Response) {
    try {
      const { page = 1, limit = 10 } = query;
      const paginationQuery = this.getPaginateQuery(page, limit);
      const total = await this.domainModel.countDocuments({}).exec(); // get total documents count
      const result = await this.domainModel
        .find({})
        .skip(paginationQuery.skip)
        .limit(paginationQuery.limit)
        .lean()
        .exec();
      return res.status(200).json({
        code: 200,
        message: 'Domains fetched successfully.',
        total,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        code: 400,
        message: 'Something went wrong. Please try again later',
        data: null,
      });
    }
  }

  // Create new domain
  async createDomain(data: CreateDomain, res: Response) {
    try {
      const { domainName, email } = data;
      const [checkDomainExists, userExists] = await Promise.all([
        this.domainModel
          .findOne({ domainName: domainName?.toLowerCase() })
          .lean()
          .exec(),
        this.userModel.findOne({ email: email?.toLowerCase() }).lean().exec(),
      ]);

      // Check domain with same name exists or not
      if (checkDomainExists) {
        return res.status(400).json({
          code: 400,
          message: 'Domain already exists.',
          data: null,
        });
      }
      // Check user with given email exists or not
      if (!userExists) {
        return res.status(400).json({
          code: 400,
          message: 'User with this email does not exists.',
          data: null,
        });
      }

      // create domain
      const response = await this.domainModel.create({
        domainName: domainName,
        ownerName: userExists.name,
        ownerId: userExists._id,
      });

      return res.status(200).json({
        code: 200,
        message: 'Domain created successfully.',
        data: response,
      });
    } catch (error) {
      return res.status(400).json({
        code: 400,
        message: 'Something went wrong. Please try again later',
        data: null,
      });
    }
  }

  // Update domain
  async updateDomain(domainId: string, data: CreateDomain, res: Response) {
    try {
      const { domainName, email } = data;
      const [checkDomainId, checkNewDomainName, checkEmailExists] =
        await Promise.all([
          this.domainModel.findOne({ _id: domainId }).lean().exec(),
          this.domainModel
            .findOne({
              _id: { $ne: domainId },
              domainName: domainName.toLowerCase(),
            })
            .lean()
            .exec(),
          this.userModel.findOne({ email: email.toLowerCase() }).lean().exec(),
        ]);

      // Check domain with given ID exists or not
      if (!checkDomainId) {
        return res.status(400).json({
          code: 400,
          message: 'Domain with this ID does not exists.',
          data: null,
        });
      }
      // Check If new domain name exists in DB or not
      if (checkNewDomainName) {
        return res.status(400).json({
          code: 400,
          message: 'New domain name is already in use.',
          data: null,
        });
      }
      // Check user with given email exists or not
      if (!checkEmailExists) {
        return res.status(400).json({
          code: 400,
          message: 'User with provided email does not exists.',
          data: null,
        });
      }
      const response = await this.domainModel
        .findOneAndUpdate(
          { _id: domainId },
          {
            domainName: domainName,
            ownerId: checkEmailExists._id,
            ownerName: checkEmailExists.name,
          },
          { new: true },
        )
        .lean()
        .exec();
      return res.status(200).json({
        code: 200,
        message: 'Domain updated successfully.',
        data: response,
      });
    } catch (error) {
      return res.status(400).json({
        code: 400,
        message: 'Something went wrong. Please try again later',
        data: null,
      });
    }
  }

  // Get all domains by ownerId
  async getDomainsByOwner(ownerId: string, res: Response) {
    try {
      const domainsList = await this.domainModel
        .find({ ownerId: ownerId })
        .lean()
        .exec();
      return res.status(200).json({
        code: 200,
        message: 'Domains fetched successfully.',
        data: domainsList,
      });
    } catch (error) {
      return res.status(400).json({
        code: 400,
        message: 'Something went wrong. Please try again later',
        data: null,
      });
    }
  }

  // Search by domain name
  async searchDomain(query: string, res: Response) {
    try {
      const response = await this.domainModel
        .find({
          domainName: {
            $regex: query,
          },
        })
        .lean()
        .exec();
      return res.status(200).json({
        code: 200,
        message: 'Domains fetched successfully.',
        data: response,
      });
    } catch (error) {
      return res.status(400).json({
        code: 400,
        message: 'Something went wrong. Please try again later',
        data: null,
      });
    }
  }
}
