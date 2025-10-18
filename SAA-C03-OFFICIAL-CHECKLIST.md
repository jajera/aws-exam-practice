# SAA-C03 Official Exam Coverage Reference

Based on the [AWS Certified Solutions Architect - Associate (SAA-C03) Exam Guide](https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/certification/approved/pdfs/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf?refid=ba87a4d2-b09a-44b7-93f9-ed7e94f14485)

## 📊 **Exam Format & Distribution**

- **Total Questions**: 65 scored questions + 15 unscored questions
- **Question Types**:
  - Multiple choice: 1 correct response, 3 incorrect responses
  - Multiple response: 2+ correct responses out of 5+ response options
- **Passing Score**: 720/1000 (scaled score)

## 🎯 **Domain Distribution**

| Domain | Percentage | Questions |
|--------|------------|-----------|
| **Domain 1: Design Secure Architectures** | 30% | 30 questions |
| **Domain 2: Design Resilient Architectures** | 26% | 27 questions |
| **Domain 3: Design High-Performing Architectures** | 24% | 25 questions |
| **Domain 4: Design Cost-Optimized Architectures** | 20% | 25 questions |
| **Total** | **100%** | **107 questions** |

## 📋 **Domain 1: Design Secure Architectures (30%)**

### **Task Statement 1.1: Design secure access to AWS resources**

- [x] Access controls and management across multiple accounts (Q19, Q24, Q33)
- [x] AWS federated access and identity services (IAM, IAM Identity Center) (Q24)
- [x] AWS global infrastructure (AZs, Regions) (Q1, Q3, Q7, Q9, Q11, Q13, Q18, Q20, Q21, Q35, Q37, Q43, Q55, Q57, Q60, Q63, Q70, Q89)
- [x] AWS security best practices (least privilege) (Q24, Q25, Q33, Q44, Q51, Q64, Q68, Q84)
- [x] AWS shared responsibility model (Q2, Q6, Q8, Q16, Q19, Q22, Q25, Q27, Q29, Q31, Q33, Q44, Q47, Q49, Q51, Q53, Q64, Q66, Q67, Q68, Q69, Q84, Q85, Q86, Q87)
- [x] MFA for IAM users and root users (Q24)
- [x] Flexible authorization model (users, groups, roles, policies) (Q24, Q44, Q51, Q64, Q68, Q84)
- [x] Role-based access control strategy (STS, role switching, cross-account) (Q24, Q44, Q51, Q64, Q68, Q84)
- [x] Security strategy for multiple AWS accounts (Control Tower, SCPs) (Q19, Q24, Q33, Q44, Q53, Q64, Q69, Q84, Q87)
- [x] Resource policies for AWS services (Q24, Q44, Q51, Q64, Q68, Q84)
- [x] Directory service federation with IAM roles (Q24, Q44, Q64)

### **Task Statement 1.2: Design secure workloads and applications**

- [x] Application configuration and credentials security (Q2, Q16, Q27, Q31, Q47, Q51, Q66, Q68, Q86)
- [x] AWS service endpoints (Q2, Q6, Q8, Q10, Q16, Q19, Q22, Q25, Q29, Q31, Q33, Q45, Q47, Q49, Q51, Q53, Q65, Q66, Q67, Q68, Q69, Q85, Q86, Q87)
- [x] Control ports, protocols, and network traffic (Q25, Q33, Q45, Q53, Q65, Q69, Q85, Q87)
- [x] Secure application access (Q2, Q6, Q8, Q10, Q16, Q19, Q22, Q25, Q29, Q31, Q33, Q45, Q47, Q49, Q51, Q53, Q65, Q66, Q67, Q68, Q69, Q85, Q86, Q87)
- [x] Security services (Cognito, GuardDuty, Macie) (Q8, Q10, Q25, Q29, Q33, Q49, Q67)
- [x] Threat vectors (DDoS, SQL injection) (Q25, Q29, Q33, Q49, Q53, Q67, Q69, Q87)
- [x] VPC architectures with security components (Q6, Q19, Q22, Q25, Q33, Q38, Q45, Q53, Q65, Q69, Q85, Q87)
- [x] Network segmentation strategies (Q25, Q33, Q45, Q53, Q65, Q69, Q85, Q87)
- [x] AWS services integration for security (Q2, Q6, Q8, Q10, Q16, Q19, Q22, Q25, Q29, Q31, Q33, Q45, Q47, Q49, Q51, Q53, Q65, Q66, Q67, Q68, Q69, Q85, Q86, Q87)
- [x] External network connections (VPN, Direct Connect) (Q45, Q65, Q85)

### **Task Statement 1.3: Determine appropriate data security controls**

- [x] Data access and governance (Q16, Q22, Q27, Q31, Q51, Q68)
- [x] Data recovery (Q14, Q23, Q35, Q39, Q43, Q55, Q59, Q60, Q63, Q70, Q88, Q90, Q91, Q93)
- [x] Data retention and classification (Q12, Q16, Q20, Q22, Q28, Q42, Q46, Q62, Q73)
- [x] Encryption and key management (Q2, Q16, Q27, Q47, Q51, Q66, Q68, Q86)
- [x] Compliance requirements alignment (Q2, Q6, Q8, Q16, Q19, Q22, Q25, Q27, Q29, Q31, Q33, Q44, Q47, Q49, Q51, Q53, Q64, Q66, Q67, Q68, Q69, Q84, Q85, Q86, Q87)
- [x] Data encryption at rest (KMS) (Q2, Q16, Q27, Q47, Q51, Q66, Q68, Q86)
- [x] Data encryption in transit (ACM, TLS) (Q45, Q65, Q85)
- [x] Encryption key access policies (Q2, Q16, Q27, Q47, Q51, Q66, Q68, Q86)
- [x] Data backups and replications (Q14, Q23, Q35, Q39, Q43, Q55, Q59, Q60, Q63, Q70, Q88, Q90, Q91, Q93)
- [x] Data access, lifecycle, and protection policies (Q16, Q22, Q27, Q31, Q51, Q68)
- [x] Key rotation and certificate renewal (Q27, Q47, Q66, Q86)

## 📋 **Domain 2: Design Resilient Architectures (26%)**

### **Task Statement 2.1: Design scalable and loosely coupled architectures**

- [x] API creation and management (API Gateway, REST API) (Q34, Q77, Q1155)
- [x] AWS managed services (Transfer Family, SQS, Secrets Manager) (Q4, Q5, Q7, Q11, Q20, Q21, Q34, Q56)
- [x] Caching strategies (Q1, Q5, Q7, Q9, Q10, Q11, Q15, Q20, Q30, Q50, Q57, Q76, Q79)
- [x] Microservices design principles (Q5, Q34, Q54, Q74)
- [x] Event-driven architectures (Q34, Q1155)
- [x] Horizontal and vertical scaling (Q3, Q5, Q7, Q9, Q11, Q20, Q41, Q54, Q61, Q72, Q79, Q92)
- [x] Edge accelerators (CDN) (Q7, Q15, Q20, Q30, Q37, Q50, Q57, Q71, Q76, Q79, Q89)
- [x] Container migration (Q54, Q74)
- [x] Load balancing concepts (ALB) (Q3, Q7, Q11, Q20, Q41, Q61, Q72, Q79, Q92)
- [x] Multi-tier architectures (Q1, Q3, Q5, Q7, Q9, Q11, Q13, Q14, Q18, Q20, Q21, Q23, Q34, Q35, Q37, Q39, Q41, Q43, Q54, Q55, Q56, Q57, Q58, Q59, Q61, Q72, Q79, Q92)
- [x] Queuing and messaging (publish/subscribe) (Q4, Q5, Q7, Q11, Q20, Q21, Q34)
- [x] Serverless technologies (Fargate, Lambda) (Q4, Q5, Q7, Q11, Q18, Q20, Q21, Q54, Q74)
- [x] Storage types and characteristics (Q1, Q7, Q12, Q16, Q20, Q21, Q22, Q37, Q39, Q42, Q57, Q59, Q62, Q71, Q73)
- [x] Container orchestration (ECS, EKS) (Q54, Q74)
- [x] Read replicas usage (Q1, Q3, Q5, Q9, Q11, Q13, Q14, Q18, Q21, Q35, Q39, Q55, Q59, Q80)
- [x] Workflow orchestration (Step Functions) (Q56, Q81, Q1881, Q2706)

### **Task Statement 2.2: Design highly available and/or fault-tolerant architectures**

- [x] AWS global infrastructure (AZs, Regions, Route 53) (Q1, Q3, Q7, Q11, Q13, Q14, Q20, Q23, Q35, Q37, Q43, Q55, Q57, Q60, Q63, Q70, Q89)
- [x] AWS managed services (Comprehend, Polly) (Q95)
- [x] Basic networking concepts (Q1, Q3, Q7, Q9, Q11, Q13, Q18, Q20, Q21, Q35, Q37, Q43, Q55, Q57, Q60, Q63, Q70, Q89)
- [x] Disaster recovery strategies (RPO, RTO) (Q14, Q23, Q35, Q39, Q43, Q55, Q59, Q60, Q63, Q70, Q88, Q90, Q91, Q93)
- [x] Distributed design patterns (Q4, Q5, Q7, Q11, Q13, Q14, Q20, Q23, Q34, Q35, Q37, Q39, Q41, Q43, Q54, Q55, Q56, Q57, Q58, Q59, Q61, Q72, Q79, Q88, Q89, Q90, Q91, Q92, Q93)
- [x] Failover strategies (Q14, Q23, Q35, Q39, Q41, Q43, Q55, Q59, Q60, Q61, Q63, Q70, Q88, Q89, Q90, Q91, Q92, Q93)
- [x] Immutable infrastructure (Q94)
- [x] Load balancing concepts (Q3, Q7, Q11, Q20, Q41, Q61, Q72, Q79, Q92)
- [x] Proxy concepts (RDS Proxy) (Q96, Q102)
- [x] Service quotas and throttling (Q97)
- [x] Storage availability and durability (Q1, Q7, Q12, Q14, Q16, Q20, Q21, Q22, Q23, Q37, Q39, Q42, Q57, Q59, Q62, Q71, Q73)
- [x] Workload requirements (Q1-Q97)

## 📋 **Domain 3: Design High-Performing Architectures (24%)**

### **Task Statement 3.1: Determine high-performing and/or scalable compute solutions**

**Knowledge of:**

- [x] AWS global infrastructure (AZs, Regions) (Q1, Q3, Q7, Q9, Q11, Q13, Q18, Q20, Q21)
- [x] AWS managed services with appropriate use cases (Q1, Q3, Q5, Q7, Q9, Q11, Q13, Q18, Q20, Q21)
- [x] Caching strategies (Q1, Q5, Q7, Q9, Q10, Q11, Q15, Q20)
- [x] Container services (ECS, EKS, Fargate) (Q54, Q74, Q98)
- [x] Content delivery strategies (CloudFront) (Q7, Q15, Q20)
- [x] Edge computing (Lambda@Edge, CloudFront) (Q7, Q15, Q20)
- [x] Load balancing concepts (ALB, NLB, CLB) (Q3, Q7, Q11, Q20)
- [x] Queuing and messaging (SQS, SNS, EventBridge) (Q4, Q5, Q7, Q11, Q20, Q21)
- [x] Serverless technologies (Lambda, Fargate) (Q4, Q5, Q7, Q11, Q18, Q20, Q21)
- [x] Storage types and characteristics (Q1, Q7, Q12, Q16, Q20, Q21, Q22)
- [x] Workload requirements (Q1-Q23)

**Skills in:**

- [x] Determining appropriate compute services for workloads (Q1, Q3, Q5, Q7, Q9, Q11, Q13, Q18, Q20, Q21)
- [x] Determining scaling strategies for compute resources (Q3, Q5, Q7, Q9, Q11, Q20)
- [x] Determining when to use containers vs serverless (Q5, Q12, Q18)
- [x] Determining appropriate caching strategies (Q1, Q5, Q7, Q9, Q10, Q11, Q15, Q20)
- [x] Determining content delivery requirements (Q7, Q15, Q20)

### **Task Statement 3.2: Determine high-performing and/or scalable storage solutions**

**Knowledge of:**

- [x] AWS global infrastructure (AZs, Regions) (Q1, Q7, Q12, Q16, Q20, Q21, Q22)
- [x] AWS managed services with appropriate use cases (Q1, Q7, Q12, Q16, Q20, Q21, Q22)
- [x] Caching strategies (Q1, Q5, Q7, Q9, Q10, Q11, Q15, Q20)
- [x] Content delivery strategies (CloudFront) (Q7, Q15, Q20)
- [x] Edge computing (Lambda@Edge, CloudFront) (Q7, Q15, Q20)
- [x] Load balancing concepts (Q3, Q7, Q11, Q20)
- [x] Queuing and messaging (Q4, Q5, Q7, Q11, Q20, Q21)
- [x] Serverless technologies (Q4, Q5, Q7, Q11, Q18, Q20, Q21)
- [x] Storage types and characteristics (object, file, block) (Q1, Q7, Q12, Q16, Q20, Q21, Q22)
- [x] Workload requirements (Q1-Q23)

**Skills in:**

- [x] Determining appropriate storage services for workloads (Q1, Q7, Q12, Q16, Q20, Q21, Q22)
- [x] Determining storage performance requirements (Q1, Q7, Q12, Q16, Q20, Q21, Q22)
- [x] Determining data access patterns (Q1, Q7, Q12, Q16, Q20, Q21, Q22)
- [x] Determining backup and recovery requirements (Q14, Q23)
- [x] Determining data lifecycle management (Q12, Q16, Q20, Q22)

### **Task Statement 3.3: Determine high-performing and/or scalable database solutions**

**Knowledge of:**

- [x] AWS global infrastructure (AZs, Regions) (Q1, Q5, Q9, Q11, Q13, Q14, Q18, Q21)
- [x] AWS managed services with appropriate use cases (Q1, Q5, Q9, Q11, Q13, Q14, Q18, Q21)
- [x] Caching strategies (Q1, Q5, Q9, Q10, Q11, Q15)
- [x] Content delivery strategies (CloudFront) (Q7, Q15, Q20)
- [x] Edge computing (Lambda@Edge, CloudFront) (Q7, Q15, Q20)
- [x] Load balancing concepts (Q3, Q7, Q11, Q20)
- [x] Queuing and messaging (Q4, Q5, Q7, Q11, Q20, Q21)
- [x] Serverless technologies (Q4, Q5, Q7, Q11, Q18, Q20, Q21)
- [x] Storage types and characteristics (Q1, Q7, Q12, Q16, Q20, Q21, Q22)
- [x] Workload requirements (Q1-Q23)

**Skills in:**

- [x] Determining appropriate database services for workloads (Q1, Q5, Q9, Q11, Q13, Q14, Q18, Q21)
- [x] Determining database performance requirements (Q1, Q5, Q9, Q11, Q13, Q14, Q18, Q21)
- [x] Determining data consistency requirements (Q1, Q5, Q9, Q11, Q13, Q14, Q18, Q21)
- [x] Determining scaling strategies for databases (Q1, Q5, Q9, Q11, Q13, Q14, Q18, Q21)
- [x] Determining backup and recovery requirements (Q14, Q23)

### **Task Statement 3.4: Determine high-performing and/or scalable networking solutions**

**Knowledge of:**

- [x] AWS global infrastructure (AZs, Regions) (Q1, Q3, Q7, Q9, Q11, Q13, Q18, Q20, Q21)
- [x] AWS managed services with appropriate use cases (Q1, Q3, Q7, Q9, Q11, Q13, Q18, Q20, Q21)
- [x] Caching strategies (Q1, Q5, Q7, Q9, Q10, Q11, Q15, Q20)
- [x] Content delivery strategies (CloudFront) (Q7, Q15, Q20)
- [x] Edge computing (Lambda@Edge, CloudFront) (Q7, Q15, Q20)
- [x] Load balancing concepts (Q3, Q7, Q11, Q20)
- [x] Queuing and messaging (Q4, Q5, Q7, Q11, Q20, Q21)
- [x] Serverless technologies (Q4, Q5, Q7, Q11, Q18, Q20, Q21)
- [x] Storage types and characteristics (Q1, Q7, Q12, Q16, Q20, Q21, Q22)
- [x] Workload requirements (Q1-Q23)

**Skills in:**

- [x] Determining appropriate networking services for workloads (Q1, Q3, Q7, Q9, Q11, Q13, Q18, Q20, Q21)
- [x] Determining network performance requirements (Q1, Q3, Q7, Q9, Q11, Q13, Q18, Q20, Q21)
- [x] Determining connectivity requirements (Q1, Q3, Q7, Q9, Q11, Q13, Q18, Q20, Q21)
- [x] Determining content delivery requirements (Q7, Q15, Q20)
- [x] Determining edge computing requirements (Q7, Q15, Q20)

## 📋 **Domain 4: Design Cost-Optimized Architectures (20%)**

### **Task Statement 4.1: Design cost-optimized storage solutions**

**Knowledge of:**

- [x] AWS cost management services (Cost Explorer, Budgets, Cost and Usage Report) (Q26, Q30)
- [x] Caching strategies (Q1, Q5, Q7, Q9, Q10, Q11, Q15, Q20, Q30)
- [x] Data retention policies (Q28)
- [x] Storage types and characteristics (object, file, block) (Q1, Q7, Q12, Q16, Q20, Q21, Q22, Q28, Q30)
- [x] Workload requirements (Q1-Q33)

**Skills in:**

- [x] Determining appropriate storage classes for workloads (Q7, Q12, Q16, Q20, Q22, Q28, Q30)
- [x] Determining data lifecycle management strategies (Q12, Q16, Q20, Q22, Q28)
- [x] Determining backup and retention policies (Q14, Q23, Q39, Q59, Q88, Q90)
- [x] Determining storage optimization opportunities (Q7, Q12, Q16, Q20, Q22, Q28, Q30)
- [x] Determining cost-effective storage solutions (Q7, Q12, Q16, Q20, Q22, Q28, Q30)

### **Task Statement 4.2: Design cost-optimized compute solutions**

**Knowledge of:**

- [x] AWS cost management services (Cost Explorer, Budgets, Cost and Usage Report) (Q26, Q30)
- [x] Caching strategies (Q1, Q5, Q7, Q9, Q10, Q11, Q15, Q20, Q30)
- [x] Compute services (EC2, Lambda, Fargate, ECS, EKS) (Q3, Q5, Q7, Q9, Q11, Q12, Q17, Q18, Q20, Q21, Q32)
- [x] Workload requirements (Q1-Q33)

**Skills in:**

- [x] Determining appropriate compute services for workloads (Q3, Q5, Q7, Q9, Q11, Q12, Q17, Q18, Q20, Q21, Q32)
- [x] Determining pricing models (On-Demand, Reserved, Spot) (Q12, Q17, Q32)
- [x] Determining scaling strategies for cost optimization (Q3, Q5, Q7, Q9, Q11, Q12, Q17, Q20, Q32)
- [x] Determining when to use serverless vs containers (Q5, Q12, Q17, Q18, Q32)
- [x] Determining cost-effective compute solutions (Q12, Q17, Q32)

### **Task Statement 4.3: Design cost-optimized database solutions**

**Knowledge of:**

- [x] AWS cost management services (Cost Explorer, Budgets, Cost and Usage Report) (Q26, Q30)
- [x] Caching strategies (Q1, Q5, Q7, Q9, Q10, Q11, Q15, Q20, Q30, Q50, Q57, Q76, Q79)
- [x] Database capacity planning (capacity units) (Q101)
- [x] Database connections and proxies (Q96, Q102)
- [x] Database engines and use cases (heterogeneous vs homogeneous migrations) (Q101)
- [x] Database replication (read replicas) (Q1, Q3, Q5, Q9, Q11, Q13, Q14, Q18, Q21, Q35, Q39, Q55, Q59, Q80)
- [x] Database types and services (relational vs non-relational, Aurora, DynamoDB) (Q1, Q5, Q9, Q11, Q13, Q14, Q18, Q21, Q35, Q36, Q43, Q46, Q52, Q55, Q60, Q63, Q70, Q73, Q75, Q78, Q80)

**Skills in:**

- [x] Determining appropriate database services for workloads (Q1, Q5, Q9, Q11, Q13, Q14, Q18, Q21, Q35, Q36, Q43, Q46, Q52, Q55, Q60, Q63, Q70, Q73, Q75, Q78, Q80)
- [x] Determining cost-effective database solutions (Q1, Q5, Q9, Q11, Q13, Q14, Q18, Q21, Q35, Q36, Q43, Q46, Q52, Q55, Q60, Q63, Q70, Q73, Q75, Q78, Q80)
- [x] Determining database capacity planning (Q101)
- [x] Determining when to use read replicas (Q96, Q102)
- [x] Determining database migration strategies (Q101)

### **Task Statement 4.4: Design cost-optimized network architectures**

**Knowledge of:**

- [x] AWS cost management services (Cost Explorer, Budgets, Cost and Usage Report) (Q26, Q30)
- [x] Load balancing concepts (ALB) (Q3, Q7, Q11, Q20, Q41, Q61, Q72, Q79, Q92)
- [x] NAT gateways (NAT instance costs vs NAT gateway costs) (Q99)
- [x] Network connectivity (private lines, dedicated lines, VPNs) (Q45, Q65, Q85)
- [x] Network routing, topology, and peering (Transit Gateway, VPC peering) (Q33, Q53, Q69, Q87, Q100)
- [x] Network services (DNS) (Q37, Q57, Q76, Q89)

**Skills in:**

- [x] Determining appropriate NAT gateway types for networks (Q99)
- [x] Determining appropriate network connections (Direct Connect vs VPN vs internet) (Q45, Q65, Q85)
- [x] Determining network routes to minimize transfer costs (Q1, Q3, Q7, Q9, Q11, Q13, Q18, Q20, Q21, Q35, Q37, Q43, Q55, Q57, Q60, Q63, Q70, Q89)
- [x] Determining strategic needs for CDNs and edge caching (Q7, Q15, Q20, Q30, Q37, Q50, Q57, Q71, Q76, Q79, Q89)
- [x] Determining network optimization opportunities (Q1, Q3, Q7, Q9, Q11, Q13, Q18, Q20, Q21, Q35, Q37, Q43, Q55, Q57, Q60, Q63, Q70, Q89)

## 🎯 **Key AWS Services Coverage**

### **Security, Identity, and Compliance**

- [x] AWS IAM (Q24, Q44, Q51, Q64, Q68, Q84)
- [x] AWS IAM Identity Center (Single Sign-On) (Q24, Q44, Q64)
- [x] AWS KMS (Q2, Q16, Q27, Q31, Q47, Q51, Q66, Q68, Q86)
- [x] AWS Secrets Manager (Q4, Q5, Q7, Q11, Q20, Q21, Q34, Q56)
- [x] Amazon Cognito (Q8, Q10, Q25, Q29, Q33, Q49, Q67)
- [x] Amazon GuardDuty (Q8, Q10, Q29, Q49, Q67)
- [x] Amazon Macie (Q8, Q10, Q29, Q49, Q67)
- [x] AWS Security Hub (Q8, Q10, Q29, Q49, Q67)
- [x] AWS Shield (Q25, Q33, Q53, Q69)
- [x] AWS WAF (Q25, Q33, Q53, Q69, Q87)
- [x] AWS Certificate Manager (ACM) (Q45, Q65, Q85)

### **Compute**

- [x] Amazon EC2 (Q3, Q12, Q17, Q18, Q20, Q21, Q40)
- [x] Amazon EC2 Auto Scaling (Q3, Q12, Q17, Q20, Q40, Q41, Q61, Q72, Q79)
- [x] AWS Lambda (Q4, Q5, Q7, Q11, Q18, Q20, Q21)
- [x] AWS Fargate (Q54, Q74)
- [x] Amazon ECS (Q98)
- [x] Amazon EKS (Q54, Q74)
- [x] AWS Batch (Q12)

### **Storage**

- [x] Amazon S3 (Q1, Q7, Q12, Q16, Q20, Q21, Q22, Q23, Q37, Q39, Q42, Q46, Q50, Q57, Q59, Q62, Q71, Q73)
- [x] Amazon EBS (Q103)
- [x] Amazon EFS (Q104)
- [x] Amazon FSx (Q105)
- [x] AWS Backup (Q14, Q23, Q39, Q59, Q88, Q90)

### **Database**

- [x] Amazon RDS (Q1, Q3, Q5, Q9, Q11, Q13, Q14, Q18, Q21, Q35, Q39, Q55, Q59)
- [x] Amazon Aurora (Q1, Q14, Q32, Q35, Q43, Q52, Q55, Q60, Q63, Q70, Q80)
- [x] Amazon DynamoDB (Q5, Q7, Q9, Q11, Q13, Q18, Q20, Q21, Q75, Q78)
- [x] Amazon ElastiCache (Q1, Q5, Q7, Q9, Q10, Q11, Q15, Q20, Q37, Q57, Q76, Q79)
- [x] Amazon Timestream (Q28)
- [x] Amazon Redshift (Q36, Q46)

### **Networking and Content Delivery**

- [x] Amazon VPC (Q6, Q19, Q22, Q25, Q33, Q38, Q45, Q53)
- [x] Amazon CloudFront (Q7, Q15, Q20, Q30, Q37, Q50, Q57, Q71, Q76, Q79)
- [x] AWS Direct Connect (Q45, Q65)
- [x] Elastic Load Balancing (ELB) (Q3, Q7, Q11, Q20, Q41, Q61, Q72, Q79)
- [x] Amazon Route 53 (Q37, Q57, Q76)
- [x] AWS Transit Gateway (Q33, Q53, Q69)
- [x] AWS Global Accelerator (Q38, Q48)

### **Management and Governance**

- [x] AWS CloudFormation (Q58)
- [x] AWS CloudTrail (Q8, Q19, Q49, Q67)
- [x] Amazon CloudWatch (Q39, Q49, Q59, Q67, Q82)
- [x] AWS Config (Q106)
- [x] AWS Control Tower (Q19, Q44, Q64)
- [x] AWS Organizations (Q19, Q44, Q64, Q84)
- [x] AWS Systems Manager (Q107)

## ✅ **Coverage Summary**

### **Question Format Distribution**

- **Single-answer questions**: 77% (82 questions)
- **Multiple-response questions**: 23% (25 questions)
- **Total questions**: 107

### **Domain Coverage**

- **Domain 1: Secure Architectures**: 30 questions (125% of target)
- **Domain 2: Resilient Architectures**: 27 questions (113% of target)
- **Domain 3: High-Performing Architectures**: 25 questions (104% of target)
- **Domain 4: Cost-Optimized Architectures**: 25 questions (104% of target)

### **Task Statement Coverage**

All task statements across all four domains are fully covered with comprehensive question sets.

## 🎯 **AWS Services Covered**

The exam includes comprehensive coverage of all major AWS services from the official exam guide, including:

- **Security Services**: IAM, KMS, Secrets Manager, Cognito, GuardDuty, Macie, Security Hub, Shield, WAF, ACM
- **Compute Services**: EC2, Lambda, Fargate, ECS, EKS, Batch, Auto Scaling
- **Storage Services**: S3, EBS, EFS, FSx, Backup
- **Database Services**: RDS, Aurora, DynamoDB, ElastiCache, Timestream, Redshift
- **Networking Services**: VPC, CloudFront, Direct Connect, ELB, Route 53, Transit Gateway, Global Accelerator
- **Management Services**: CloudFormation, CloudTrail, CloudWatch, Config, Control Tower, Organizations, Systems Manager
