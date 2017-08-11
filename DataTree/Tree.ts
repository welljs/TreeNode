/**
 * Created by vorobioff on 22.06.17.
 */
import MVC from 'react-redux-mvc';
import {IBasicModel} from 'interfaces/IBasicModel';
import {ITreeNodeState, TreeNode} from './TreeNode';

interface ITreeChainSchema {
  key: string;
  ref: string;
}

interface ITreeIndex<V> {
  [key: string]: V;
}

export class Tree<M extends IBasicModel<any>> {
  public collection: MVC.Collection<M>;
  public root: Array<TreeNode<M>>;
  public index: ITreeIndex<TreeNode<M>>;

  constructor(Collection: new(data: M[]) => MVC.Collection<M>, data: M[]) {
    this.collection = new Collection(data);
    this.root = [];
    this.index = {};
    return this;
  }

  public build(schema: ITreeChainSchema): this {
    this.createIndex(schema);
    this.buildNodes(schema);
    return this;
  }

  public getState(): Array<ITreeNodeState<any, any>> {
    return this.root.reduce((res: any[], node: TreeNode<any>) => {
      res.push(node.getState());
      return res;
    }, []);
  }

  private createIndex(chainSchema: ITreeChainSchema): this {
    const {models} = this.collection;
    const {key, ref} = chainSchema;
    models.forEach((model: M) => {
      const node = new TreeNode(model.getState());
      const indexKey = model.getState(ref);
      if (indexKey) {
        this.index[indexKey] = node;
      }
      if (!model.getState(key)) {
        this.root.push(node);
      }
    });
    return this;
  }

  private buildNodes(schema: ITreeChainSchema): this {
    const {models} = this.collection;
    const {key, ref} = schema;
    models.forEach((model) => {
      const indexKey = model.getState(ref);
      const buildKey = model.getState(key);
      if (buildKey && indexKey) {
        const parentNode = this.index[buildKey];
        const childNode = this.index[indexKey];
        if (!parentNode.hasChild(childNode)) {
          parentNode.addChild(childNode);
        }
      }
    });
    return this;
  }
}
